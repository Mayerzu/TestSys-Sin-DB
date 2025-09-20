async function logout() {
	try {
		const resp = await fetch('/logout', {
			method: 'POST'
		});

		const data = await resp.json();

		if (!resp.ok) {
			throw new Error(`HTTP error! status: ${resp.status}`);
		}

		if (data.success) {
			sessionStorage.clear();
			window.location.href = data.redirect || '/login';
		} else {
			console.error('Error al cerrar sesión:', data.message);
		}

	} catch (error) {
		console.error('Error al cerrar sesión:', error);
	}
}

const handleNavbar = async () => {
	// Navbar CSS
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = '/static/css/navbar.css';
	document.head.appendChild(link);

	// Resaltar link activo
	const currentPath = window.location.pathname;

	document.querySelectorAll('.nav-link').forEach(link => {
		const linkPath = link.getAttribute('href');

		if (currentPath === linkPath || currentPath.startsWith(linkPath + '/')) {
			link.classList.add('active');
		}
	});

	const navbarContainer = document.getElementById("navbar-container");
	if (!navbarContainer) return;

	const menuToggle = document.getElementById("menu-toggle");
	const sidebar = document.getElementById("sidebar");
	const closeSidebar = document.getElementById("close-sidebar");
	const profileToggle = document.getElementById("profile-toggle");
	const sidebarProfileToggle = document.getElementById("sidebar-profile-toggle");
	const modal = document.getElementById('profile-modal');
	const modalContent = document.getElementById('modal-content');
	const closeModal = document.getElementById('close-modal');
	let logoutButton = document.getElementById('btn-logout');

	// Manejar sidebar
	if (menuToggle && sidebar && closeSidebar) {
		menuToggle.addEventListener("click", () => {
			sidebar.classList.remove("hidden");
		});

		closeSidebar.addEventListener("click", () => {
			sidebar.classList.add("hidden");
		});

		sidebar.addEventListener("click", (e) => {
			if (e.target === sidebar) {
				sidebar.classList.add("hidden");
			}
		});
	}

	// Función para reiniciar eventos
	function setupEvents() {
		let logoutButton = document.querySelector('#profile-modal #btn-logout');

		if (logoutButton) {
			logoutButton.removeEventListener('click', logout);
			logoutButton.addEventListener('click', logout);
		}
	}

	// Inicializar eventos
	setupEvents();

	// Manejar perfil
	if (profileToggle && modal) {
		profileToggle.addEventListener("click", () => {
			window.location.href = '/profile';
		});
	}

	if (sidebarProfileToggle && modal) {
		sidebarProfileToggle.addEventListener("click", () => {
			window.location.href = '/profile';
		});
	}

	// Manejar cierre del modal
	if (closeModal && modal) {
		closeModal.addEventListener("click", () => {
			modal.classList.remove('show');
		});
	}

	if (modal) {
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				modal.classList.remove('show');
			}
		});
	}

	// Observar cambios en navbar y modal
	const observer = new MutationObserver(() => {
		setupEvents();
	});

	observer.observe(navbarContainer, { childList: true, subtree: true });

	const profileModal = document.getElementById('profile-modal');

	if (profileModal) {
		observer.observe(profileModal, { childList: true, subtree: true });
	} else {
		observer.observe(document.body, { childList: true, subtree: true });
	}

	// Escuchar eventos de recarga del modal
	window.addEventListener('profileModalUpdated', setupEvents);
}

document.addEventListener('DOMContentLoaded', handleNavbar);
const $btnLogoutSideBar = document.getElementById('btn-logout-sidebar');
$btnLogoutSideBar && $btnLogoutSideBar.addEventListener('click', logout);