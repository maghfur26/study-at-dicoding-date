let hamburger = document.querySelector('.hamburger');
let navUl = document.querySelector('.nav-ul');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('hamburger-active')
    navUl.classList.toggle('nav-active')
})