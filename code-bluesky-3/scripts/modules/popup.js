const profileMenuToggler = document.querySelector('.profile__menu-toggler');
const profileMenuPopup = document.querySelector('.profile__menu-popup');

profileMenuToggler.addEventListener('click', () => {
	profileMenuToggler.setAttribute('aria-expanded', 'true');
	profileMenuPopup.toggleAttribute('hidden');
});
