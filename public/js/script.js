document.addEventListener('DOMContentLoaded', function(){
 const allButtons= document.querySelectorAll('.searchBtn');
//  the searchBtn is gotten from the header.ejs file. we use the class to get a queryselector  
 const searchBar= document.querySelector('/.searchBar');
 //this is gotten from the class name from the search.ejs
  const searchInput= document.getElementsById('searchInput');
  //this is gotten from the id in the search.ejs
  const searchClose= document.getElementsById('searchClose');
  //this is gotten from the id in the search.ejs

  for(var i=0; i<allButtons.length; i++){
    allButton[i].addEventListener('click', function() {
        searchBar.style.visibility='visible';
        searchBar.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        searchInput.focus();
    });

  }
      searchClose[i].addEventListener('click', function() {
        searchBar.style.visibility='hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'false');
        searchInput.focus();
    });

  
})