/**
* Jetro Web Development
* Project Created: April 10, 2024 
* Author: Jetro Web Team
*/ 
 
 
 /**
   * Jetro Window bar variable & function
   */
 function showNavbar(){
  const navBar = document.querySelector(".Tech")
  navBar.style.display = "flex"
};
function hideNavbar (){
  const navBar = document.querySelector(".Tech")
  navBar.style.display = "none"
};

 const navWindowButton = document.querySelector(".windowButton");
 const navMenu = document.querySelector(".nav-menu");

 navWindowButton.addEventListener("click", () => {
    navWindowButton.classList.toggle("active");
    navMenu.classList.toggle("active");
 })

 let eventSection = document.querySelectorAll('.event-section');

window.onscroll =() =>{
    eventSection.forEach(sec => {
      let top = window.scrollY;
      let offset = sec.offsetTop - 150;
      let height = sec.offsetHeight;

      if (top >= offset && top < offset + height){
        sec.classList.add('show-animate')
      }
      else{
        sec.classList.remove('show-animate')
      }
    })
}


//  function showNavbar(){
//   const navBar = document.querySelector(".Tech")
//   navBar.style.display = "flex"
// };
// function hideNavbar (){
//   const navBar = document.querySelector(".Tech")
//   navBar.style.display = "none"
// };


const jetro_Window = document.querySelector(".nav_window");
const jetro_Menu = document.querySelector(".nav_menu");

// jetro_Window.addEventListener("click", ()=>{
//     jetro_Window.classList.toggle("active");
//     jetro_Menu.classList.toggle("active");

// })

// document.querySelectorAll(".nav_list").forEach(n => n.addEventListener("click", ()=>{
//     jetro_Window.classList.remove("active");
//     jetro_Menu.classList.remove("active");
// }))

 /**
   * End of Window bar
   */


 // Get the div element using document.querySelector
const nav = document.querySelector('.about_btn');
const navlist = document.querySelector('.about_content');

// Add a click event listener to the div element
nav.addEventListener('onclick', () => {
  // Add your click event logic here
  navlist.style.display = "block";

});


// Decidim Service Script
function togglePricing(plan) {
  if (plan === 'monthly') {
    document.getElementById('starter-price-monthly').style.display = 'block';
    document.getElementById('starter-price-yearly').style.display = 'none';
    document.getElementById('pro-price-monthly').style.display = 'block';
    document.getElementById('pro-price-yearly').style.display = 'none';
    document.getElementById('custom-price-monthly').style.display = 'block';
    document.getElementById('custom-price-yearly').style.display = 'none';
  } else {
    document.getElementById('starter-price-monthly').style.display = 'none';
    document.getElementById('starter-price-yearly').style.display = 'block';
    document.getElementById('pro-price-monthly').style.display = 'none';
    document.getElementById('pro-price-yearly').style.display = 'block';
    document.getElementById('custom-price-monthly').style.display = 'none';
    document.getElementById('custom-price-yearly').style.display = 'block';
  }
}

// JavaScript for "Read more" / "Read less" functionality
document.querySelectorAll('.read-more-btn').forEach(button => {
  button.addEventListener('click', () => {
    const moreText = button.previousElementSibling.querySelector('.more-text');
    if (moreText.style.display === 'none') {
      moreText.style.display = 'inline';
      button.textContent = 'Read less';
    } else {
      moreText.style.display = 'none';
      button.textContent = 'Read more';
    }
  });
});