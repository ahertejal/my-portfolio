const revealItems = document.querySelectorAll(".reveal");
const modeToggle = document.getElementById("modeToggle");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalImage = document.getElementById("modalImage");

const certButtons = document.querySelectorAll('[data-modal="certificate"]');
const projectButtons = document.querySelectorAll('[data-modal="project"]');
const allImages = document.querySelectorAll("img");
const contactItems = document.querySelectorAll(".contact-item");
const toast = document.getElementById("toast");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  modeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  modeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

function createFallbackImage(name) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#edf2ff"/>
          <stop offset="100%" stop-color="#cfe0ff"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <rect x="45" y="45" width="1110" height="710" rx="24" fill="none" stroke="#2f7df6" stroke-opacity="0.55" stroke-width="3"/>
      <text x="50%" y="48%" text-anchor="middle" fill="#1f63ce" font-size="54" font-family="Segoe UI, Arial, sans-serif">${name}</text>
      <text x="50%" y="58%" text-anchor="middle" fill="#5d6474" font-size="26" font-family="Segoe UI, Arial, sans-serif">Place your image in /images folder with this file name</text>
    </svg>
  `)}`;
}

allImages.forEach((image) => {
  image.addEventListener("error", () => {
    const fileName = image.getAttribute("src") || "image.jpg";
    image.src = createFallbackImage(fileName);
  });
});

function openModal(title, description, imageSrc) {
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalImage.src = imageSrc;
  modalImage.alt = title;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const title = button.dataset.title || "Project";
    const description = button.dataset.description || "Project details";
    const image = button.dataset.image || "images/project1.jpg";

    openModal(title, description, image);
  });
});

certButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const title = button.dataset.title || "Certification";
    const image = button.dataset.image || "images/cert1.jpg";

    openModal(
      title,
      "This certificate preview opens in a popup. Replace this image with your real certificate image in the images folder.",
      image
    );
  });
});

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target.dataset.close === "true") {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

let toastTimer;

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

async function copyToClipboard(value, label) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(`${label} copied`);
  } catch (error) {
    showToast(`Could not copy ${label.toLowerCase()}`);
  }
}

contactItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    const type = item.dataset.contactType;
    const value = item.dataset.contactValue;

    if (!type || !value) {
      return;
    }

    if (type === "phone") {
      event.preventDefault();
      try {
        window.location.href = `tel:${value}`;
      } catch (error) {
        copyToClipboard(value, "Phone number");
      }
      return;
    }

    if (type === "email") {
      event.preventDefault();
      try {
        window.location.href = `mailto:${value}`;
      } catch (error) {
        copyToClipboard(value, "Email");
      }
      return;
    }

    if (type === "external") {
      event.preventDefault();
      window.location.href = value;
    }
  });
});
