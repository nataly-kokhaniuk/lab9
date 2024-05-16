let activeTab = "signup";
function openTab(tabName) {
  let i, tabcontent, tabbuttons;

  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tabbuttons = document.getElementsByClassName("tab-button");
  for (i = 0; i < tabbuttons.length; i++) {
    tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName + "tab").className += " active";
  if (tabName === activeTab) {
    return;
  }
  if (activeTab === "signup") {
    clearSignupForm();
  } else if (activeTab === "login") {
    clearLoginForm();
  }
  activeTab = tabName;
}
function clearSignupForm() {
  document.getElementById("signup-username").value = "";
  document.getElementById("signup-email").value = "";
  document.getElementById("signup-password").value = "";
  document.getElementById("signup-confirm-password").value = "";
  document.getElementById("username-error").innerText = "";
  document.getElementById("email-error").innerText = "";
  document.getElementById("password-error").innerText = "";
  document.getElementById("confirm-password-error").innerText = "";
  document.getElementById("signup-username").style.borderColor = "";
  document.getElementById("signup-email").style.borderColor = "";
  document.getElementById("signup-password").style.borderColor = "";
  document.getElementById("signup-confirm-password").style.borderColor = "";
  document.getElementById("loader").style.display = "none";
  document.getElementById("success-registration").style.display = "none";
}

function clearLoginForm() {
  document.getElementById("login-username").value = "";
  document.getElementById("login-password").value = "";
  document.getElementById("login-username-error").innerText = "";
  document.getElementById("login-password-error").innerText = "";
  document.getElementById("login-username").style.borderColor = "";
  document.getElementById("login-password").style.borderColor = "";
  document.getElementById("loader").style.display = "none";
}

function togglePassword(fieldId) {
  let field = document.getElementById(fieldId);
  if (field.type === "password") {
    field.type = "text";
  } else {
    field.type = "password";
  }
}

// Set default tab
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".tab-button").click();
});
// Виклик функції при завантаженні сторінки
document.addEventListener("DOMContentLoaded", checkAuthentication);
document.addEventListener("DOMContentLoaded", () => {
  const isNone =
    window.getComputedStyle(document.getElementById("container-friends"))
      .display === "none";
  if (isNone) return;
  const storedUsers = localStorage.getItem("usersList");
  if (storedUsers) {
    usersList = JSON.parse(storedUsers);
    applyFiltersFromURL();
    filterAndSortUsers();
    //displayUsers(usersList.slice(0, usersPerPage)); // Display first usersPerPage users initially
  } else {
    loadUsers();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
});
function validateSignupForm() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document
    .getElementById("signup-confirm-password")
    .value.trim();
  const usernameField = document.getElementById("signup-username");
  const emailField = document.getElementById("signup-email");
  const passwordField = document.getElementById("signup-password");
  const confirmPasswordField = document.getElementById(
    "signup-confirm-password"
  );
  const usernameError = document.getElementById("username-error");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById(
    "confirm-password-error"
  );

  let isValid = true;

  if (username.length < 3 || username.length > 15) {
    usernameError.innerText = "Username must be between 3 and 15 characters.";
    usernameError.style.color = "red";
    usernameField.style.borderColor = "red";
    isValid = false;
  } else {
    usernameError.innerText = "";
    usernameError.style.color = "";
    usernameField.style.borderColor = "green";
  }

  //  email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email) || email === "") {
    emailError.innerText = "Invalid email format.";
    emailError.style.color = "red";
    emailField.style.borderColor = "red";
    isValid = false;
  } else {
    emailError.innerText = "";
    emailError.style.color = "";
    emailField.style.borderColor = "green";
  }

  if (password.length < 6) {
    passwordError.innerText = "Password must be at least 6 characters long.";
    passwordError.style.color = "red";
    passwordField.style.borderColor = "red";
    isValid = false;
  } else {
    passwordError.innerText = "";
    passwordError.style.color = "";
    passwordField.style.borderColor = "green";
  }

  if (confirmPassword !== password) {
    confirmPasswordError.innerText = "Passwords do not match.";
    confirmPasswordError.style.color = "red";
    confirmPasswordField.style.borderColor = "red";
    isValid = false;
  } else {
    confirmPasswordError.innerText = "";
    confirmPasswordError.style.color = "";
    confirmPasswordField.style.borderColor = "green";
  }

  return isValid;
}

function submitSignupForm(event) {
  event.preventDefault();

  if (!validateSignupForm()) {
    return;
  }

  const loader = document.getElementById("loader");
  const successRegistration = document.getElementById("success-registration"); // Змінена назва змінної
  loader.style.display = "block"; // Показати лоадер

  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  fakeApiCall()
    .then((response) => {
      loader.style.display = "none"; // Приховати лоадер
      successRegistration.style.display = "block"; // Показати повідомлення про успішну реєстрацію
      new Promise((resolve, reject) => {
        setTimeout(() => {
          successRegistration.style.display = "none";
          document.getElementById("signup-form").reset();
          clearSignupForm();
          resolve("Success");
          openTab("login"); // Викликати функцію переходу на вкладку "Login"
          document.getElementById("login-username").value = username; // Заповнити поле Username на вкладці "Login"
          document.getElementById("login-password").value = password; // Заповнити поле Password на вкладці "Login"
        }, 1000); // Затримка
      });
    })
    .catch((error) => {

      loader.style.display = "none"; // Приховати лоадер при помилці
      alert("Signup failed: " + error + " Please try again later.");
    });
}

function validateLoginForm() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const usernameError = document.getElementById("login-username-error");
  const passwordError = document.getElementById("login-password-error");
  const usernameField = document.getElementById("login-username");
  const passwordField = document.getElementById("login-password");

  let isValid = true;

  if (username === "") {
    usernameError.innerText = "Please enter your username.";
    usernameError.style.color = "red";
    usernameField.style.borderColor = "red";
    isValid = false;
  } else {
    if (username.length < 3 || username.length > 15) {
      usernameError.innerText = "Username must be between 3 and 15 characters.";
      usernameError.style.color = "red";
      usernameField.style.borderColor = "red";
      isValid = false;
    } else {
      usernameError.innerText = "";
      usernameError.style.color = "";
      usernameField.style.borderColor = "green";
    }
  }

  if (password === "") {
    passwordError.innerText = "Please enter your password.";
    passwordError.style.color = "red";
    passwordField.style.borderColor = "red";
    isValid = false;
  } else {
    if (password.length < 6) {
      passwordError.innerText = "Password must be at least 6 characters long.";
      passwordError.style.color = "red";
      passwordField.style.borderColor = "red";
      isValid = false;
    } else {
      passwordError.innerText = "";
      passwordError.style.color = "";
      passwordField.style.borderColor == "green";
    }
  }

  return isValid;
}

function submitLoginForm(event) {
  event.preventDefault(); // Зупиняємо стандартну подію відправки форми

  if (!validateLoginForm()) {
    return; // Якщо форма не пройшла валідацію, не відправляємо її
  }
  const username = document.getElementById("login-username").value;
  const loader = document.getElementById("loader");
  loader.style.display = "block"; // Show loader
  fakeApiCall()
    .then((response) => {

      document.getElementById("login-form").reset();

      clearLoginForm();

      loader.style.display = "none"; // Приховати лоадер після успіху

      authenticateUser(username);
      const storedUsers = localStorage.getItem("usersList");
      if (storedUsers) {
        usersList = JSON.parse(storedUsers);
        applyFiltersFromURL();
        filterAndSortUsers();

        //displayUsers(usersList.slice(0, usersPerPage)); // Display first 10 users initially
      } else {
        loadUsers();
      }
    })
    .catch((error) => {
      loader.style.display = "none"; // Приховати лоадер після помилки
      alert("Signin failed: " + error + " Please try again later.");
    });
}

function fakeApiCall() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Імітуємо успішну відповідь або помилку сервера
      const success = Math.random() > 0.04; // 96% успіху, 4% помилки
      if (success) {
        resolve("Success");
      } else {
        reject("Server error");
      }
    }, 1500); // Затримка
  });
}

//friends

// Функція для авторизації користувача
function authenticateUser(usname) {
  // Можлива логіка для перевірки користувача на сервері
  const userData = { username: usname };
  localStorage.setItem("user", JSON.stringify(userData));

  checkAuthentication(); // Оновити сторінку після авторизації
}

document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication();

  document.querySelector(".burger-menu").addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("active");
    const sidebarComputedStyle = getComputedStyle(sidebar);
    const sidebarDisplay = sidebarComputedStyle.getPropertyValue("display");

    if (sidebarDisplay === "block" || sidebarDisplay === "flex") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    logoutUser();
  });
});

// Функція для перевірки, чи користувач авторизований
function checkAuthentication() {
  // Отримуємо інформацію про користувача з localStorage
  const user = localStorage.getItem("user");

  if (user) {
    // Парсимо JSON-рядок до об'єкта
    const userData = JSON.parse(user);

    // Перевіряємо наявність username і виводимо його в консоль
    if (userData && userData.username) {
      document.getElementById("user-info").innerText = `${userData.username}`;
    }

    // Відображаємо відповідні елементи
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("container-autorization").style.display = "none";
    document.getElementById("container-friends").style.display = "block";
    document.getElementById("image-container").style.display = "none";
  } else {
    // Відображаємо відповідні елементи для неавторизованого користувача
    // document.getElementById("user-info").innerText = "Not logged in";
    // document.getElementById("logout-btn").style.display = "none";
    document.getElementById("container-autorization").style.display = "block";
    document.getElementById("image-container").style.display = "block";
    document.getElementById("container-friends").style.display = "none";
  }
}

// Функція для виходу з системи
function logoutUser() {
  localStorage.removeItem("user");
  //видалення друзів
  localStorage.removeItem("usersList");
  usersList = [];
  clearSidebar();

  checkAuthentication(); // Оновити сторінку після виходу з системи
  window.location.href = "index.html";
}

//додавання людей

let usersList = [];

function loadUsers(count = 50) {
  usersList = [];
  let promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(
      fetch("https://randomuser.me/api/")
        .then((response) => response.json())
        .then((data) => data.results[0])
    );
  }

  Promise.all(promises)
    .then((results) => {
      usersList.push(...results);
      localStorage.setItem("usersList", JSON.stringify(usersList));
      applyFiltersFromURL();
      filterAndSortUsers();
      // displayUsers(usersList.slice(0, usersPerPage)); // Display first 10 users initially
    })
    .catch((error) => {

    });
}

let currentIndex = 0;
const usersPerPage = 5;
function displayUsers(users) {
  const mainContent = document.querySelector(".main-content");
  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");
    userCard.innerHTML = `
  <img src="${user.picture.large}" alt="User Photo" class="user-photo">
  <div class="user-info">
    <h3>${user.name.first} ${user.name.last}</h3>
    <div><img src="resources/age_icon.png" alt="Age Icon" class="icon"><span>${
      user.dob.age
    }</span></div>
    <div><img src="resources/registration_date_icon.png" alt="Registration Date Icon" class="icon"><span>${new Date(
      user.registered.date
    ).toLocaleDateString()}</span></div>
    <div><img src="resources/address_icon.png" alt="Address Icon" class="icon"><span>${
      user.location.street.name
    }, ${user.location.city}</span></div>
    <div class="email"><img src="resources/email_icon.png" alt="Email Icon" class="icon"> <a href="mailto:${
      user.email
    }">${user.email}</a></div>
    <div><img src="resources/phone_icon.png" alt="Phone Icon" class="icon"><span>${
      user.phone
    }</span></div>
  </div>
`;
    mainContent.appendChild(userCard);
  });
}
//вивід при скролінгу
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
    currentIndex += usersPerPage;
    displayUsers(usersList.slice(currentIndex, currentIndex + usersPerPage));
  }
});

//прокручування вверх сторінки
document.addEventListener("DOMContentLoaded", function () {
  var scroll_arrow = document.querySelector(".scrollup");
  // scroll_arrow - це змінна, яка отримала стрілку з документа
  window.addEventListener("scroll", function () {
    if (window.scrollY < 100) {
      scroll_arrow.style.display = "none";
    } else {
      scroll_arrow.style.display = "flex";
    }
  });
  scroll_arrow.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

//debounce  фільтрація по полю пошуку
function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

function filterUsers(keyword) {
  // Оновлення usersList з Local Storage
  const storedUsers = localStorage.getItem("usersList");
  if (storedUsers) {
    usersList = JSON.parse(storedUsers);
  } else {
    usersList = [];
  }
  const filteredUsers = usersList.filter((user) => {
    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
    return fullName.includes(keyword.toLowerCase());
  });
  // Очищення main-content
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = "";
  // Перезапис відфільтрованого масиву у usersList
  usersList = filteredUsers;
  // Відображення перших usersPerPage карточок
  currentIndex = 0;
  displayUsers(usersList.slice(currentIndex, currentIndex + usersPerPage));
}

const filteredSearch = debounce((keyword) => {
  filterUsers(keyword);
}, 300);

const searchBar = document.querySelector(".search-bar");

searchBar.addEventListener("input", () => {
  const keyword = searchBar.value.trim();
  filteredSearch(keyword);
});

//Сортування і фільтрування в бічній панелі
const filterBtn = document.getElementById("filter-btn");
filterBtn.addEventListener("click", () => {

  // Отримуємо значення обраних радіобаттонів для сортування
  const sortOptions = document.querySelectorAll('input[name="sort"]');
  let selectedSortOption = ""; //"none", "name-asc", "name-desc", "date-asc", "date-desc"
  for (const option of sortOptions) {
    if (option.checked) {
      selectedSortOption = option.value;
      break;
    }
  }

  // Отримуємо значення з полів фільтрації
  const minAge = document.getElementById("min-age").value;
  const maxAge = document.getElementById("max-age").value;
  const nameFilter = document.getElementById("name").value.toLowerCase();
  const addressFilter = document.getElementById("address").value.toLowerCase();
  const emailFilter = document.getElementById("email").value.toLowerCase();

  filterAndSortUsers(
    selectedSortOption,
    minAge,
    maxAge,
    nameFilter,
    addressFilter,
    emailFilter
  );
  updateURL(
    selectedSortOption,
    minAge,
    maxAge,
    nameFilter,
    addressFilter,
    emailFilter
  );
});

function filterAndSortUsers(
  selectedSortOption = "none",
  minAge = "",
  maxAge = "",
  nameFilter = "",
  addressFilter = "",
  emailFilter = ""
) {
  const storedUsers = localStorage.getItem("usersList");
  if (storedUsers) {
    usersList = JSON.parse(storedUsers);
  } else {
    usersList = [];
  }
  let filteredUsers = usersList.filter((user) => {
    const age = parseInt(user.dob.age);
    if ((age < minAge && minAge > 0) || (age > maxAge && maxAge > 0))
      return false;
    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
    if (!fullName.includes(nameFilter.toLowerCase())) return false;
    const adress =
      `${user.location.street.name}, ${user.location.city}`.toLowerCase();
    if (!adress.includes(addressFilter.toLowerCase())) return false;
    const email = user.email;
    if (!email.includes(emailFilter.toLowerCase())) return false;
    return true;
  });
  switch (selectedSortOption) {
    case "name-asc":
      filteredUsers.sort((a, b) => {
        const fullNameA = `${a.name.first} ${a.name.last}`.toLowerCase();
        const fullNameB = `${b.name.first} ${b.name.last}`.toLowerCase();
        return fullNameA.localeCompare(fullNameB);
      });
      break;
    case "name-desc":
      filteredUsers.sort((a, b) => {
        const fullNameA = `${a.name.first} ${a.name.last}`.toLowerCase();
        const fullNameB = `${b.name.first} ${b.name.last}`.toLowerCase();
        return fullNameB.localeCompare(fullNameA);
      });
      break;
    case "date-asc":
      filteredUsers.sort(
        (a, b) => new Date(a.registered.date) - new Date(b.registered.date)
      );
      break;
    case "date-desc":
      filteredUsers.sort(
        (a, b) => new Date(b.registered.date) - new Date(a.registered.date)
      );
      break;
    default:
      // Не сортувати
      break;
  }

  // Очищення main-content
  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = "";
  // Перезапис відфільтрованого масиву у usersList
  usersList = filteredUsers;
  // Відображення перших usersPerPage карточок
  currentIndex = 0;
  displayUsers(usersList.slice(currentIndex, currentIndex + usersPerPage));
}

function updateURL(
  selectedSortOption,
  minAge,
  maxAge,
  nameFilter,
  addressFilter,
  emailFilter
) {
  // Формуємо URL з параметрами та оновлюємо адресний рядок браузера
  const params = new URLSearchParams();
  params.set("sort", selectedSortOption);
  params.set("minage", minAge);
  params.set("maxage", maxAge);
  params.set("name", nameFilter);
  params.set("address", addressFilter);
  params.set("email", emailFilter);
  const newUrl = `${window.location.origin}${
    window.location.pathname
  }?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  applyFiltersFromURL();
});

function applyFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);

  const selectedSortOption = params.get("sort") || "none";
  const minAge = params.get("minage") || "";
  const maxAge = params.get("maxage") || "";
  const nameFilter = params.get("name") || "";
  const addressFilter = params.get("address") || "";
  const emailFilter = params.get("email") || "";

  document.querySelector(
    `input[name="sort"][value="${selectedSortOption}"]`
  ).checked = true;
  document.getElementById("min-age").value = minAge;
  document.getElementById("max-age").value = maxAge;
  document.getElementById("name").value = nameFilter;
  document.getElementById("address").value = addressFilter;
  document.getElementById("email").value = emailFilter;

  filterAndSortUsers(
    selectedSortOption,
    minAge,
    maxAge,
    nameFilter,
    addressFilter,
    emailFilter
  );
}

//очищення фільтрів

function clearSidebar() {
  document.getElementById("min-age").value = "";
  document.getElementById("max-age").value = "";
  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
  document.getElementById("email").value = "";
  const sortOptions = document.querySelectorAll('input[name="sort"]');
  for (let option of sortOptions) {
    option.checked = false;
  }
  const noneSort = document.querySelector('input[name="sort"][value="none"]');
  noneSort.checked = true;
  filterAndSortUsers();
}
const clearFilterBtn = document.getElementById("clear-filter-btn");
clearFilterBtn.addEventListener("click", () => {
  clearSidebar();
});

const userLogo = document.getElementById("user-logo");


userLogo.addEventListener("click", function () {
  
	window.location.href = "index.html";
  
});
