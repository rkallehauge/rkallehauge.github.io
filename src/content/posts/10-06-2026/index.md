---
title: JWT authentication
published: 2026-06-10
description: Delving into token versioning and invalidation 
image: "./cover.jpg"
tags: ["Backend", "Cyber Security", "JWT"]
category: Blog
draft: false
---

JSON Web Tokens are ubiquitous, versatile and simple to implement, what more can you ask for? 

# Statelessness 
One of the core elements of JWTs are their lack of state, which is also somehow it's greatest weakness depending on how you look at it. Suppose you're a doorman at a private nightclub and you need to check whether people are allowed in, how would you do this? You could have a list of names with guests that are allowed in. This works fine, but guests have a tendency to leave and come back at a later time, resulting in having to do redundant lookups on the guest list. In practice they stamp their guests, so they can quickly be let back in. This is essentially what a JWT is, after authenticating (Guest list with Photo ID) you are granted a token (hand stamp) so the doorman (server) knows whether to let you in without doing an authentication challenge.

However, if you somehow bypass the authentication step and just get the proof of authentication, you are granted access. This is called a replay attack, which can be done through a myriad of methods, some easier than others, the methodology is the same regardless. 

# Replay attack
  a. Acquire bearer token
    -Done through XSS, network sniffing, malware on victim pc or other ways
  b. Set token
    -Easily done with a http client or burpsuite
  c. Authenticate
    -Send a request with the bearer token set to see whether it worked
  d. Steal data or whatever
    -Sell on darknet or extort victim (don't actually do any of this)

# How can we mitigate this?
There are a bunch of ways to combat this, none of them are perfect soltuions and each have their own limitations, but using them together definitely minimizes the drawbacks. Two of which I have implemented in my current project, first of which is:

# Token Blacklisting
When a user logs out we know that their JWT needs to be invalidated, so further requests with the same JWT should be treated as unauthenticated. How do we do this?
Firstly, we need to be able to identify each JWT, this is done through a JWT identifier, or a JTI, which is just a GUID we append to the JWT. With this, we can keep a record of which JWTs have been invalidated, this recordkeeping is usually done through caching, in my case using Valkey. Valkey is essentially the same as Redis, it actually is Redis... or rather an open-source fork of Redis, which was made a while back after the licensing of Redis changed into a triple licensed faux open-source amalgamantion. Anyhow, it is interchangable with Redis, which is the most important part here.
(Non-relevant code has been left out)
1. Add a unique identifier to user claims
```csharp
  private string GenerateToken(User user)
  {

      var claims = new[]
      {
          new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
          new Claim(ClaimTypes.Name, user.Username),
          new Claim(ClaimTypes.Role, user.Role.ToString()),
          new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Jwt id for token blacklisting
      };
      var key = new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(_config["JWT:SigningKey"])
      );

      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
          issuer: _config["Jwt:Issuer"],
          audience: _config["Jwt:Audience"],
          claims: claims,
          expires: DateTime.UtcNow.AddMinutes(10), // limited lifespan for token, if token gets compromised we limit damage extent, but don't limit lifespan so much it puts exessive strain on server
          signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
  }
```
2. Setup token invalidation
```csharp
public Result Logout(string jti, string username)
{
  // null checks for jti & username 
  var cacheKey = $"blacklist:{jti}";
  _cache.StringSet(cacheKey, "1", TimeSpan.FromMinutes(10)); 

  // update token version

  return Result.OK();
}
```
  2a. This should also occur when user has/is
    * Changed password 
    * Deleted
    * Changed permissions 
3. Check blacklist after valid token
```csharp
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
     options.Events = new JwtBearerEvents 
     {
         OnTokenValidated = async context => 
         {
          string? username = context.Principal?.Identity?.Name;
          string? jti = context.Principal?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

          var isBlacklisted = _cache.StringGet($"blacklist:{jti}");

          if (!string.IsNullOrEmpty(isBlacklisted))
          {
              context.Fail("Token is blacklisted, you need to re-authenticate.");
          }
         }
     };
    };
```
This method has it's drawbacks, one of which is the overhead we add to every single request caused by checking the cache, meaning added latency and excessive memory usage. However, it allows for us to blacklist singular JWTs (granular blacklisting), meaning we don't have to terminate all the users sessions at once, which is definitely useful for some applications, e.g. you're logged on multiple devices, and only need to log out of a single one, a public library pc or something. However, at times, we DO need to terminate all user sessions, if a user is compromised or has their password reset, which this method is essentially useless for, we can however use:

# Token Versioning
Which is essentially just a number we track for each user and check with each request. If we get a token with the same version as we have stored, IncomingToken(5) == DB/Cache(5), the token has not been deprecated, and the request goes on through. If there is a mismatch however, we know to ignore the request. That's essentially all there is to it.

1. Set up token versioning
```csharp
  private bool updateTokenVersion(string username)
  {
      var affected = _context.Users.Where(u => u.Username == username).ExecuteUpdate(s => s.SetProperty(u => u.TokenVersion, u => u.TokenVersion + 1));
      return affected == 1;
  }
```
2. Add a token version to user claims
```csharp
 private string GenerateToken(User user)
 {

     var claims = new[]
     {
         // other claim stuff
         new Claim("tokenVersion", user.TokenVersion.ToString()) 
     };

     var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

     var token = new JwtSecurityToken(
         issuer: _config["Jwt:Issuer"],
         audience: _config["Jwt:Audience"],
         claims: claims,
         expires: DateTime.UtcNow.AddMinutes(10),
         signingCredentials: creds
     );

     return new JwtSecurityTokenHandler().WriteToken(token);
 }
```

3. Update token version when applicable
```csharp
  public Result Logout(string username)
  {

    if(string.IsNullOrEmpty(username))
    {
        return Result.Fail(new Error("USER.LOGOUT_FAILED", "No username was provided."));
    }

    if (!updateTokenVersion(username))
    {
        return Result.Fail(new Error("USER.LOGOUT_FAILED", "Failed to update token version for user."));
    }

    return Result.OK();
  }
```

4. Check version on each request
```csharp 
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
      options.Events = new JwtBearerEvents 
        {
            OnTokenValidated = async context => // JWT Blacklisting, Versioning and possibly future sec implementations
            {
                string? username = context.Principal?.Identity?.Name; // or use a specific claim if you have one for username
                string? tokenVersion = context.Principal?.FindFirst("tokenVersion")?.Value;

                if(string.IsNullOrEmpty(tokenVersion))
                {
                    context.Fail("Token is invalid, you need to re-authenticate.");
                }

                // Check token version for server-side invalidation
                string? currentTokenVersion;
                // check cache before hitting db
                if (cache.KeyExists($"tokenVersion:{username}"))
                {
                    currentTokenVersion = cache.StringGet($"tokenVersion:{username}");
                }
                else
                {
                    currentTokenVersion = db.Users.Where(u => u.Username == username).Select(u => u.TokenVersion).FirstOrDefault().ToString();
                }
                if(string.IsNullOrEmpty(currentTokenVersion) || currentTokenVersion != tokenVersion)
                {
                    context.Fail("Token is outdated, you need to re-authenticate.");
                }
```

This method, like the previous one, also adds a little more overhead to each request, not quite as much, as we're just checking a single number for each user, whereas with blacklists, we can have many multiple times as many tokens as we have users. However, with both of these methods, we are adding state to something that was stateless prior to our tinkering, we are adding further complexity to combat something JWTs were never meant to do. The more state you add to a JWT, the closer you get to re-inventing session cookies from first principles.