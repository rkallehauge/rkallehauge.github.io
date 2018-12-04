<!-- php files can't even execute here so file extension is a bit useless but meh -->

<!DOCTYPE html>

<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- Normalize CSS -->
        <link rel="stylesheet" href="normalize.css">
        
        <!-- Custom CSS -->
        <link rel="stylesheet" href="style.css">

        <!-- Custom JS -->
        <script type="text/javascript" src="main.js"></script>

        <!--
            not in use
            Circles in the background 
            <script src="circle.js"></script>
        -->
    </head>
    <body>
        <header>
            <nav>

                <a id="mobile-menu"><img src="img/hamburger.svg"></a>
                <ul class="navigation">
                    <li><a href="#">Forside</a></li>
                    <li><a href="#">Projekter</a></li>
                    <li><a href="#">Kontakt</a></li>
                </ul>
                <div class="login">
                    <a id="login">Login</a> 
                    <div id="login-form">
                        <label>Username
                            <input name="username" required>
                        </label>
                        <label>Password
                            <input name="password" type="password" required>
                        </label>
                        <input type=submit>
                    </div>
                </div>
            </nav>
        </header>

        <main>
            <!--
                <div class='faded-background'>
                    <canvas id="canvas"></canvas>
                </div>
            -->
            <div class='wrapper'>
                <div class="content">
                    <div class="primary"> <!-- Static content -->
                        <article>
                            <div>
                                <h2>Bing advarer mod kendt kegle afspiller</h2>
                                <p>Der bliver advaret at keglen kan være specielt farlig. Men ingen ved hvorfor.</p>
                                <a>Læs mere</a>
                            </div>
                            <img src="https://images.videolan.org/images/icons-VLC/vlc.mini.svg">
                        </article>

                        <article>
                            <div>
                                <h2>Tyskland pwnet af Russiske hackere</h2>
                                <p>Nogle Tyske script kiddies er blevet smækket af nogle Russiske LEETS</p>
                                <a>Læs mere</a>
                            </div>
                            <img src="https://pbs.twimg.com/profile_images/861015379140673536/gfYySMtS_400x400.jpg">
                        </article>

                        <article>
                            <div>
                                <h2>Tag en løbetur i en uendelig skov</h2>
                                <p>En spiludvikler har udviklet et spil, der hedder Minecraft. Åbenbart...</p>
                                <a>Læs mere</a>
                            </div>      
                            <img src="https://s0.geograph.org.uk/geophotos/04/98/90/4989000_8472b775.jpg">
                        </article>

                        <article>
                            <div>
                                <h2>50.000 hackere printet af PewDiePie</h2>
                                <p>En Giraf under dæknavnet PewDiePie har printet en enorm mængde hackere</p>
                                <a>Læs mere</a>
                            </div>
                            <img src="https://hackadaycom.files.wordpress.com/2017/10/hackercrowbar.jpg">
                        </article>
                    </div>

                    <div class="side"> <!-- Noget med jQuery -->
                        
                    </div>
                </div>
            </div>
        </main>

        <footer>

            <div class="wrapper">
                <div class="contact-info">
                    <p>Rasmus Wissing Kallehauge</p>
                    <p>+45 42 46 98 18</p>
                    <p>rkallehauge@gmail.com</p>
                </div>
                <div class="contact-links">
                    <a href="https://www.linkedin.com/in/rasmus-wissing-kallehauge-bb6756150/" target="_blank">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" class="social-logo">
                    </a>
                    <a href="https://github.com/rkallehauge" target="_blank">
                        <img src="https://image.flaticon.com/icons/png/512/25/25231.png" class="social-logo">
                    </a>
                </div>
            </div>
        </footer>
    </body>
</html>
