document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('header nav a');
  const sections = {
    sectionHome: document.getElementById('sectionHome'),
    sectionDanhGia: document.getElementById('sectionDanhGia'),
    sectionKetQua: document.getElementById('sectionKetQua')
  };

  menuLinks.forEach(link=>{
    link.addEventListener('click', e=>{
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      sections[targetId].scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  function highlightMenu(){
    const scrollPos = window.scrollY || window.pageYOffset;
    let current='sectionHome';
    for(const key in sections){
      if(sections[key].offsetTop-80 <= scrollPos) current=key;
    }
    menuLinks.forEach(link=>{
      if(link.getAttribute('href')==='#'+current) link.classList.add('active');
      else link.classList.remove('active');
    });
  window.addEventListener('scroll', highlightMenu);
  highlightMenu();
.menu-active{
  font-weight:700;
  color:#1976d2;
  text-decoration:underline;
}
