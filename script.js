// ==============================
// USUÁRIOS PADRÃO DO SISTEMA
// ==============================
const defaultUsers = [
  {
    username: "admin",
    password: "1234",
    role: "admin",
    roleLabel: "Administrador"
  },
  {
    username: "vendas",
    password: "1234",
    role: "vendas",
    roleLabel: "Operador de Vendas"
  },
  {
    username: "producao",
    password: "1234",
    role: "producao",
    roleLabel: "Operador de Produção"
  }
];

// ==============================
// MÓDULOS DISPONÍVEIS
// ==============================
const modules = [
  {
    id: "hb",
    title: "Food Express System - HB",
    description: "Sistema de vendas e pedidos da operação HB.",
    allowedRoles: ["admin", "vendas"],
    link: "modules/hb/index.html",
    category: "vendas",
    badge: "ATENDIMENTO",
    icon: "🛒"
  },
  {
    id: "sf",
    title: "Food Express System - SF",
    description: "Sistema de vendas e pedidos da operação Street Food.",
    allowedRoles: ["admin", "vendas"],
    link: "modules/sf/index.html",
    category: "vendas",
    badge: "STREET FOOD",
    icon: "🍔"
  },
  {
    id: "defumados",
    title: "Recipe Engine - Defumados",
    description: "Módulo de receitas e produção da linha de defumados.",
    allowedRoles: ["admin", "producao"],
    link: "modules/defumados/index.html",
    category: "producao",
    badge: "PRODUÇÃO",
    icon: "🔥"
  },
  {
    id: "linguicas",
    title: "Recipe Engine - Linguiças",
    description: "Módulo de receitas e produção da linha de linguiças.",
    allowedRoles: ["admin", "producao"],
    link: "modules/linguicas/index.html",
    category: "producao",
    badge: "RECEITAS",
    icon: "🌭"
  }
];

// ==============================
// FUNÇÕES DE BANCO LOCAL
// ==============================
function getUsers() {
  const users = localStorage.getItem("msgt_users");

  if (!users) {
    localStorage.setItem("msgt_users", JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  return JSON.parse(users);
}

function saveUsers(users) {
  localStorage.setItem("msgt_users", JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem("msgt_logged_user", JSON.stringify(user));
}

function getCurrentUser() {
  const user = localStorage.getItem("msgt_logged_user");
  return user ? JSON.parse(user) : null;
}

function clearCurrentUser() {
  localStorage.removeItem("msgt_logged_user");
}

// ==============================
// LOGIN
// ==============================
function handleLogin(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("loginMessage");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const users = getUsers();

  const foundUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (foundUser) {
    setCurrentUser(foundUser);
    window.location.href = "dashboard.html";
  } else {
    if (message) {
      message.textContent = "Usuário ou senha inválidos.";
    }
  }
}

// ==============================
// DASHBOARD PREMIUM V2
// ==============================
function loadDashboard() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const welcomeText = document.getElementById("welcomeText");
  const adminButton = document.getElementById("adminButton");
  const profileLabel = document.getElementById("profileLabel");
  const moduleCount = document.getElementById("moduleCount");

  const salesSection = document.getElementById("salesSection");
  const productionSection = document.getElementById("productionSection");
  const salesModules = document.getElementById("salesModules");
  const productionModules = document.getElementById("productionModules");

  const availableModules = modules.filter((module) =>
    module.allowedRoles.includes(user.role)
  );

  if (welcomeText) {
    welcomeText.textContent = `Olá, ${user.username} | Perfil: ${user.roleLabel}`;
  }

  if (profileLabel) {
    profileLabel.textContent = user.roleLabel;
  }

  if (moduleCount) {
    moduleCount.textContent = availableModules.length;
  }

  if (user.role === "admin" && adminButton) {
    adminButton.classList.remove("hidden");
  }

  const sales = availableModules.filter((module) => module.category === "vendas");
  const production = availableModules.filter((module) => module.category === "producao");

  if (salesSection && salesModules) {
    if (sales.length > 0) {
      salesSection.classList.remove("hidden");
      salesModules.innerHTML = sales.map(renderModuleCard).join("");
    } else {
      salesSection.classList.add("hidden");
      salesModules.innerHTML = "";
    }
  }

  if (productionSection && productionModules) {
    if (production.length > 0) {
      productionSection.classList.remove("hidden");
      productionModules.innerHTML = production.map(renderModuleCard).join("");
    } else {
      productionSection.classList.add("hidden");
      productionModules.innerHTML = "";
    }
  }
}

function renderModuleCard(module) {
  const cardClass = module.category === "vendas" ? "card-vendas" : "card-producao";

  return `
    <div class="module-card ${cardClass}">
      <div class="module-top">
        <div class="module-icon">${module.icon}</div>
        <span class="module-badge">${module.badge}</span>
        <h3>${module.title}</h3>
        <p>${module.description}</p>
      </div>

      <div class="module-footer">
        <span class="module-status">Pronto para acesso</span>
        <button class="btn-primary" onclick="openModule('${module.id}')">Acessar</button>
      </div>
    </div>
  `;
}

// ==============================
// ABERTURA DOS MÓDULOS
// ==============================
function openModule(moduleId) {
  const selectedModule = modules.find((module) => module.id === moduleId);

  if (!selectedModule) return;

  window.location.href = selectedModule.link;
}

// ==============================
// ÁREA ADMINISTRATIVA
// ==============================
function loadAdminPage() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  if (user.role !== "admin") {
    window.location.href = "dashboard.html";
    return;
  }

  renderUsers();

  const form = document.getElementById("newUserForm");
  if (form) {
    form.addEventListener("submit", handleNewUser);
  }
}

function renderUsers() {
  const usersList = document.getElementById("usersList");
  if (!usersList) return;

  const users = getUsers();

  usersList.innerHTML = users
    .map(
      (user, index) => `
        <div class="user-card">
          <div class="user-card-info">
            <h3>${user.username}</h3>
            <p>Perfil: ${user.roleLabel}</p>
            <p>Senha: ${user.password}</p>
          </div>
          <div>
            <button class="btn-danger" onclick="deleteUser(${index})">Excluir</button>
          </div>
        </div>
      `
    )
    .join("");
}

function handleNewUser(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("newUsername");
  const passwordInput = document.getElementById("newPassword");
  const roleInput = document.getElementById("newRole");
  const message = document.getElementById("adminMessage");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const role = roleInput.value;

  const users = getUsers();

  if (!username || !password || !role) {
    if (message) {
      message.textContent = "Preencha todos os campos.";
    }
    return;
  }

  const usernameExists = users.some(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );

  if (usernameExists) {
    if (message) {
      message.textContent = "Esse usuário já existe.";
    }
    return;
  }

  const roleMap = {
    admin: "Administrador",
    vendas: "Operador de Vendas",
    producao: "Operador de Produção"
  };

  users.push({
    username,
    password,
    role,
    roleLabel: roleMap[role]
  });

  saveUsers(users);

  if (message) {
    message.textContent = "Usuário cadastrado com sucesso.";
  }

  const form = document.getElementById("newUserForm");
  if (form) {
    form.reset();
  }

  renderUsers();
}

function deleteUser(index) {
  const users = getUsers();

  if (!users[index]) return;

  if (users[index].username === "admin") {
    alert("O usuário admin padrão não pode ser excluído.");
    return;
  }

  users.splice(index, 1);
  saveUsers(users);
  renderUsers();
}

// ==============================
// NAVEGAÇÃO
// ==============================
function logout() {
  clearCurrentUser();
  window.location.href = "index.html";
}

function goToAdmin() {
  window.location.href = "admin.html";
}

function goToDashboard() {
  window.location.href = "dashboard.html";
}

// ==============================
// INICIALIZAÇÃO POR PÁGINA
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const modulesContainerOld = document.getElementById("modulesContainer");
  const salesModules = document.getElementById("salesModules");
  const usersList = document.getElementById("usersList");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (modulesContainerOld || salesModules) {
    loadDashboard();
  }

  if (usersList) {
    loadAdminPage();
  }
});