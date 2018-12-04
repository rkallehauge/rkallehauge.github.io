// Once window object triggers "load" event, execute code block
window.addEventListener('load', function(){
    // Window has now loaded, and all elements are now in the DOM.


    // Login open toggle
    var login = document.getElementById('login');
    login.addEventListener('click', function(){
        var elem = document.getElementById('login-form');

        // Handle the visuals in CSS, much simpler
        elem.classList.toggle('display');
    }, false);

    // Mobile menu toggle
    var mobilemenu = document.getElementById('mobile-menu');
    mobilemenu.addEventListener('click', function(){
        var nav = document.getElementsByClassName('navigation')[0];

        // Handle the visuals in CSS, much simpler
        nav.classList.toggle('display');
    });

}, false);
