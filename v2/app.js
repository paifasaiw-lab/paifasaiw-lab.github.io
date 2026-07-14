// ข้อมูลเริ่มต้นสำหรับจำลองระบบ (Seed Data)
const initialTasks = [
    {
        id: "task-1",
        title: "ออกแบบ UI หน้ากากของแอปพลิเคชัน (Figma)",
        desc: "ออกแบบธีมมืดและสว่างในรูปแบบโปร่งแสง (Glassmorphic Dashboard) ทั้งหน้าจอเดสก์ท็อปและสมาร์ทโฟน",
        assignee: "NUT",
        priority: "high",
        startDate: "2026-07-01",
        deadline: "2026-07-07",
        status: "done"
    },
    {
        id: "task-2",
        title: "พัฒนาหน้าต่างฟอร์มสร้างและแก้ไขงาน",
        desc: "เขียนโครงสร้าง HTML/CSS หน้ากากฟอร์ม พร้อมเชื่อมโยงฟังก์ชันบันทึกข้อมูลและตรวจสอบข้อมูลที่กรอก",
        assignee: "NUT",
        priority: "medium",
        startDate: "2026-07-08",
        deadline: "2026-07-12",
        status: "progress"
    },
    {
        id: "task-3",
        title: "เขียน API สำหรับเชื่อมฐานข้อมูล PostgreSQL",
        desc: "สร้าง API Endpoints สำหรับดึงข้อมูล เพิ่ม แก้ไข และลบงาน พร้อมจัดการระบบความปลอดภัยของโทเค็น",
        assignee: "BOY",
        priority: "high",
        startDate: "2026-07-09",
        deadline: "2026-07-15",
        status: "todo"
    },
    {
        id: "task-4",
        title: "ทดสอบ Unit Test ระบบสมัครและเข้าสู่ระบบ",
        desc: "เขียนสคริปต์จำลองการกดลงทะเบียน ตรวจสอบรหัสผ่านผ่านการเข้ารหัส และทดสอบ JWT Token สำหรับยืนยันตัวตน",
        assignee: "BOY",
        priority: "low",
        startDate: "2026-07-05",
        deadline: "2026-07-11",
        status: "review"
    },
    {
        id: "task-5",
        title: "ทำความสะอาดไฟล์สไตล์และจัดกลุ่ม CSS",
        desc: "แยกไฟล์ Utility Classes และลดความซ้ำซ้อนของโค้ดสี CSS Custom Properties ให้เป็นระเบียบ",
        assignee: "A",
        priority: "low",
        startDate: "2026-07-02",
        deadline: "2026-07-05",
        status: "done"
    },
    {
        id: "task-6",
        title: "เตรียมคู่มืออธิบายเมนูและการใช้กระดานคัมบัง",
        desc: "จัดทำเอกสารแนะนำสัญรูป ป้ายกำกับสี และวิธีเปลี่ยนบทบาทสำหรับสมาชิกใหม่ในทีม",
        assignee: "A",
        priority: "medium",
        startDate: "2026-07-10",
        deadline: "2026-07-16",
        status: "todo"
    },
    {
        id: "task-7",
        title: "แก้ไขบั๊กการลากวาง (Drag & Drop) บนจอสมาร์ทโฟน",
        desc: "ปรับปรุง Touch Event เพื่อเลื่อนการ์ดงานบนกระดานคัมบังผ่านหน้าจอมือถือได้อย่างไม่สะดุด",
        assignee: "NUT",
        priority: "high",
        startDate: "2026-07-05",
        deadline: "2026-07-09",
        status: "progress"
    }
];

// รายชื่อทีมงาน
const teamMembers = ["NUT", "BOY", "A"];

// บัญชีผู้ใช้งานเริ่มต้นสำหรับการเข้าสู่ระบบ (รหัสผ่านเริ่มต้นคือ 1234 ทั้งหมด)
const defaultCredentials = {
    "admin": { password: "1234", role: "manager", memberName: "" },
    "nut": { password: "1234", role: "member", memberName: "NUT" },
    "boy": { password: "1234", role: "member", memberName: "BOY" },
    "a": { password: "1234", role: "member", memberName: "A" }
};

let userCredentials = {};

// สถานะและตัวแปรหลักของแอปพลิเคชัน
let tasks = [];
let currentRole = "manager"; // หรือ "member"
let currentMember = "";
let draggedTaskId = null;

// ดึงเวลาปัจจุบันมาใช้ตรวจเดดไลน์ (เทียบกับ 2026-07-10 ตามที่ระบบระบุ)
const TODAY_DATE = new Date("2026-07-10");

// โหลดข้อมูลเริ่มต้น
function initApp() {
    // โหลดธีมจาก LocalStorage
    const savedTheme = localStorage.getItem("teamsync_theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    // โหลดรหัสผ่านผู้ใช้งานจาก LocalStorage
    const savedCredentials = localStorage.getItem("teamsync_credentials");
    if (savedCredentials) {
        userCredentials = JSON.parse(savedCredentials);
    } else {
        userCredentials = { ...defaultCredentials };
        localStorage.setItem("teamsync_credentials", JSON.stringify(userCredentials));
    }

    // โหลดงานจาก LocalStorage
    const savedTasks = localStorage.getItem("teamsync_tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        // แปลงรายชื่อพนักงานเก่าเป็นพนักงานใหม่ในกรณีที่มีข้อมูลค้างอยู่เดิม
        let hasChanges = false;
        tasks = tasks.map(t => {
            if (t.assignee === "อลิส") { t.assignee = "NUT"; hasChanges = true; }
            else if (t.assignee === "บ็อบ") { t.assignee = "BOY"; hasChanges = true; }
            else if (t.assignee === "ชาร์ลี") { t.assignee = "A"; hasChanges = true; }
            return t;
        });
        if (hasChanges) {
            saveTasksToLocalStorage();
        }
    } else {
        tasks = [...initialTasks];
        saveTasksToLocalStorage();
    }

    setupEventListeners();
    checkLoginSession(); // ตรวจสอบเซสชันการเข้าสู่ระบบแทนการเรนเดอร์ทันที
}

// บันทึกข้อมูลงานลง LocalStorage
function saveTasksToLocalStorage() {
    localStorage.setItem("teamsync_tasks", JSON.stringify(tasks));
}

// ฟังก์ชันสลับโหมด มืด / สว่าง
function toggleTheme() {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("teamsync_theme", newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById("themeIcon");
    if (theme === "dark") {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }
}

// ตรวจสอบว่างานเลยกำหนดส่งหรือไม่
function isTaskOverdue(deadlineStr, status) {
    if (status === "done") return false;
    const deadline = new Date(deadlineStr);
    // เซ็ตเวลาเป็นศูนย์เพื่อเปรียบเทียบเฉพาะวัน/เดือน/ปี
    deadline.setHours(0,0,0,0);
    const today = new Date(TODAY_DATE);
    today.setHours(0,0,0,0);
    return deadline < today;
}

// ตรวจสอบว่างานใกล้ถึงกำหนดส่งหรือไม่ (ภายใน 24 ชั่วโมง)
function isTaskDueSoon(deadlineStr, status) {
    if (status === "done") return false;
    const deadline = new Date(deadlineStr);
    deadline.setHours(0,0,0,0);
    const today = new Date(TODAY_DATE);
    today.setHours(0,0,0,0);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 1;
}

// จัดรูปแบบวันที่เป็นภาษาไทยแบบย่อ
function formatThaiDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const months = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    // แสดงผลปี พ.ศ. (+543)
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate()} ${months[date.getMonth()]} ${thaiYear}`;
}

// คำแปลสถานะ
function getThaiStatusLabel(status) {
    switch (status) {
        case "todo": return "ต้องทำ";
        case "progress": return "กำลังทำ";
        case "review": return "ตรวจทาน";
        case "done": return "เสร็จสิ้น";
        default: return status;
    }
}

// คำแปลความสำคัญ
function getThaiPriorityLabel(priority) {
    switch (priority) {
        case "high": return "สูง";
        case "medium": return "ปานกลาง";
        case "low": return "ต่ำ";
        default: return priority;
    }
}

// ตั้งค่า Event Listeners
function setupEventListeners() {
    // ดรอปดาวน์บทบาทผู้ใช้
    const roleSelectBtn = document.getElementById("roleSelectBtn");
    const roleDropdown = document.getElementById("roleDropdown");
    
    roleSelectBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        roleDropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        roleDropdown.classList.remove("active");
    });

    roleDropdown.addEventListener("click", (e) => {
        const item = e.target.closest(".dropdown-item");
        if (!item) return;

        // ลบคลาสแอคทีฟจากรายการเดิม
        roleDropdown.querySelectorAll(".dropdown-item").forEach(el => el.classList.remove("active"));
        item.classList.add("active");

        const role = item.getAttribute("data-role");
        currentRole = role;

        if (role === "manager") {
            currentMember = "";
            document.getElementById("currentRoleText").textContent = "บทบาท: หัวหน้างาน";
            document.getElementById("roleSelectBtn").querySelector("i").className = "fa-solid fa-user-tie";
        } else {
            currentMember = item.getAttribute("data-member");
            document.getElementById("currentRoleText").textContent = `ทีมงาน: ${currentMember}`;
            document.getElementById("roleSelectBtn").querySelector("i").className = "fa-solid fa-user";
        }

        roleDropdown.classList.remove("active");
        renderApp();
    });

    // ปุ่มสลับธีม
    document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);

    // ปุ่มดาวน์โหลดข้อมูลสำรอง (Export)
    document.getElementById("exportDataBtn").addEventListener("click", () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `newteam354_tasks_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // ปุ่มนำเข้าข้อมูล (Import)
    const importBtn = document.getElementById("importDataBtn");
    const fileInput = document.getElementById("importFileInput");

    importBtn.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const parsed = JSON.parse(evt.target.result);
                if (Array.isArray(parsed)) {
                    tasks = parsed;
                    saveTasksToLocalStorage();
                    renderApp();
                    alert("นำเข้าข้อมูลสำเร็จแล้ว!");
                } else {
                    alert("รูปแบบไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์ JSON ที่ถูกต้อง");
                }
            } catch (err) {
                alert("ไม่สามารถอ่านไฟล์ได้ กรุณาตรวจสอบไฟล์ของคุณ");
            }
        };
        reader.readAsText(file);
    });

    // จัดการเกี่ยวกับการเปิด/ปิด Modal สร้างงาน
    const taskModal = document.getElementById("taskModal");
    const taskForm = document.getElementById("taskForm");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");

    document.getElementById("addNewTaskBtn").addEventListener("click", () => openTaskModal());
    document.getElementById("memberCreateTaskBtn").addEventListener("click", () => openTaskModal());
    
    closeModalBtn.addEventListener("click", closeTaskModal);
    cancelModalBtn.addEventListener("click", closeTaskModal);
    
    taskModal.addEventListener("click", (e) => {
        if (e.target === taskModal) closeTaskModal();
    });

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveTask();
    });

    // ค้นหาและคัดกรองงานในหน้าหัวหน้างาน
    document.getElementById("searchInput").addEventListener("input", renderManagerView);
    document.getElementById("filterAssignee").addEventListener("change", renderManagerView);
    document.getElementById("filterPriority").addEventListener("change", renderManagerView);
    document.getElementById("filterStatus").addEventListener("change", renderManagerView);

    // รองรับการลากวาง (Drag & Drop) ในคอลัมน์คัมบัง
    const columns = document.querySelectorAll(".kanban-column");
    columns.forEach(column => {
        column.addEventListener("dragover", (e) => {
            e.preventDefault();
            column.classList.add("drag-over");
        });

        column.addEventListener("dragleave", () => {
            column.classList.remove("drag-over");
        });

        column.addEventListener("drop", (e) => {
            e.preventDefault();
            column.classList.remove("drag-over");
            const newStatus = column.getAttribute("data-status");
            if (draggedTaskId && newStatus) {
                updateTaskStatus(draggedTaskId, newStatus);
            }
        });
    });

    // ดึงเหตุการณ์ปุ่มระบบล็อกอิน
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("logoutBtn").addEventListener("click", handleLogout);

    // จัดการเปิด/ปิดหน้าต่างเปลี่ยนรหัสผ่าน
    const passwordModal = document.getElementById("passwordModal");
    const changePasswordBtn = document.getElementById("changePasswordBtn");
    const closePasswordModalBtn = document.getElementById("closePasswordModalBtn");
    const cancelPasswordModalBtn = document.getElementById("cancelPasswordModalBtn");
    const passwordForm = document.getElementById("passwordForm");

    changePasswordBtn.addEventListener("click", () => {
        passwordForm.reset();
        passwordModal.classList.add("active");
    });

    closePasswordModalBtn.addEventListener("click", () => {
        passwordModal.classList.remove("active");
    });

    cancelPasswordModalBtn.addEventListener("click", () => {
        passwordModal.classList.remove("active");
    });

    passwordModal.addEventListener("click", (e) => {
        if (e.target === passwordModal) {
            passwordModal.classList.remove("active");
        }
    });

    passwordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleChangePassword();
    });
}

// ตรวจสอบเซสชันการล็อกอินของผู้ใช้งาน
function checkLoginSession() {
    const loggedInUser = sessionStorage.getItem("logged_in_user");
    const role = sessionStorage.getItem("logged_in_role");
    const member = sessionStorage.getItem("logged_in_member");

    const loginOverlay = document.getElementById("loginOverlay");
    const roleSelectBtn = document.getElementById("roleSelectBtn");

    if (loggedInUser && role) {
        // ปิดหน้าจอเข้าสู่ระบบ
        loginOverlay.style.display = "none";
        currentRole = role;
        currentMember = member || "";

        // กำหนดการมองเห็นระบบสลับสิทธิ์เฉพาะ Admin เท่านั้น
        if (role === "manager") {
            roleSelectBtn.style.display = "flex";
            document.getElementById("currentRoleText").textContent = "บทบาท: หัวหน้างาน";
            document.getElementById("roleSelectBtn").querySelector("i").className = "fa-solid fa-user-tie";
        } else {
            roleSelectBtn.style.display = "none"; // สมาชิกทีมทั่วไปห้ามสลับสิทธิ์
            document.getElementById("currentRoleText").textContent = `ทีมงาน: ${currentMember}`;
            document.getElementById("roleSelectBtn").querySelector("i").className = "fa-solid fa-user";
        }

        renderApp();
    } else {
        // เปิดหน้าจอเข้าสู่ระบบ
        loginOverlay.style.display = "flex";
    }
}

// จัดการเหตุการณ์เมื่อกดปุ่ม Submit เพื่อล็อกอิน
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById("usernameField").value.trim().toLowerCase();
    const password = document.getElementById("passwordField").value;
    const errorMessage = document.getElementById("loginErrorMessage");

    if (userCredentials[username] && userCredentials[username].password === password) {
        const user = userCredentials[username];
        
        // บันทึกสถานะการล็อกอินลง sessionStorage (ล็อกอินค้างไว้จนกว่าจะปิดแท็บหรือกด logout)
        sessionStorage.setItem("logged_in_user", username);
        sessionStorage.setItem("logged_in_role", user.role);
        sessionStorage.setItem("logged_in_member", user.memberName);

        errorMessage.style.display = "none";
        document.getElementById("passwordField").value = "";
        
        checkLoginSession();
    } else {
        // แจ้งเตือนข้อผิดพลาดรหัสผิด
        errorMessage.style.display = "block";
        errorMessage.style.animation = "none";
        setTimeout(() => {
            errorMessage.style.animation = "shake 0.3s";
        }, 10);
        document.getElementById("passwordField").value = "";
    }
}

// จัดการการออกจากระบบ
function handleLogout() {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?")) {
        sessionStorage.removeItem("logged_in_user");
        sessionStorage.removeItem("logged_in_role");
        sessionStorage.removeItem("logged_in_member");
        window.location.reload();
    }
}

// จัดการการเปลี่ยนรหัสผ่าน
function handleChangePassword() {
    const loggedInUser = sessionStorage.getItem("logged_in_user");
    if (!loggedInUser) {
        alert("ไม่พบเซสชันการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        window.location.reload();
        return;
    }

    const oldPassword = document.getElementById("oldPasswordField").value;
    const newPassword = document.getElementById("newPasswordField").value;
    const confirmNewPassword = document.getElementById("confirmNewPasswordField").value;

    // ตรวจสอบรหัสผ่านปัจจุบัน
    if (userCredentials[loggedInUser].password !== oldPassword) {
        alert("รหัสผ่านปัจจุบันไม่ถูกต้อง");
        return;
    }

    // ตรวจสอบความถูกต้องของรหัสผ่านใหม่
    if (newPassword.length < 4) {
        alert("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร");
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert("รหัสผ่านใหม่และรหัสผ่านยืนยันไม่ตรงกัน");
        return;
    }

    // บันทึกรหัสผ่านใหม่ลง LocalStorage
    userCredentials[loggedInUser].password = newPassword;
    localStorage.setItem("teamsync_credentials", JSON.stringify(userCredentials));
    
    alert("เปลี่ยนรหัสผ่านสำเร็จแล้ว!");
    document.getElementById("passwordModal").classList.remove("active");
}

// เปิดหน้าต่าง Modal ป้อนข้อมูล (รองรับทั้งเพิ่มใหม่ และแก้ไข)
function openTaskModal(taskId = null) {
    const taskModal = document.getElementById("taskModal");
    const modalTitle = document.getElementById("modalTitle");
    const form = document.getElementById("taskForm");
    
    // รีเซ็ตฟอร์มก่อนเติมข้อมูล
    form.reset();
    document.getElementById("taskIdField").value = "";
    
    // ตั้งค่าเริ่มต้นวันที่เริ่มต้น เป็นวันนี้
    const todayStr = TODAY_DATE.toISOString().slice(0, 10);
    document.getElementById("taskStartDate").value = todayStr;

    // ล็อกผู้รับผิดชอบเป็นชื่อพนักงานถ้าเข้าจากหน้าทีมงาน
    const assigneeField = document.getElementById("taskAssignee");
    if (currentRole === "member" && currentMember) {
        assigneeField.value = currentMember;
        assigneeField.disabled = true;
    } else {
        assigneeField.disabled = false;
    }

    if (taskId) {
        // โหมดแก้ไข
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            modalTitle.textContent = "แก้ไขรายละเอียดงาน";
            document.getElementById("taskIdField").value = task.id;
            document.getElementById("taskTitle").value = task.title;
            document.getElementById("taskDesc").value = task.desc || "";
            document.getElementById("taskAssignee").value = task.assignee;
            document.getElementById("taskPriority").value = task.priority;
            document.getElementById("taskStartDate").value = task.startDate || todayStr;
            document.getElementById("taskDeadline").value = task.deadline;
            document.getElementById("taskStatus").value = task.status;
        }
    } else {
        // โหมดเพิ่มใหม่
        modalTitle.textContent = currentRole === "manager" ? "มอบหมายงานใหม่ให้กับทีม" : "สร้างงานใหม่ของฉัน";
    }

    taskModal.classList.add("active");
}

// ปิดหน้าต่าง Modal
function closeTaskModal() {
    document.getElementById("taskModal").classList.remove("active");
}

// บันทึกการเพิ่ม/แก้ไขงาน
function saveTask() {
    const taskId = document.getElementById("taskIdField").value;
    const title = document.getElementById("taskTitle").value.trim();
    const desc = document.getElementById("taskDesc").value.trim();
    const assignee = document.getElementById("taskAssignee").value;
    const priority = document.getElementById("taskPriority").value;
    const startDate = document.getElementById("taskStartDate").value;
    const deadline = document.getElementById("taskDeadline").value;
    const status = document.getElementById("taskStatus").value;

    if (!title || !deadline) {
        alert("กรุณากรอกหัวข้อชื่องานและวันกำหนดส่งส่งมอบงาน");
        return;
    }

    if (taskId) {
        // อัปเดตงานเดิม
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                title,
                desc,
                assignee,
                priority,
                startDate,
                deadline,
                status
            };
        }
    } else {
        // สร้างงานใหม่
        const newTask = {
            id: "task-" + Date.now(),
            title,
            desc,
            assignee,
            priority,
            startDate,
            deadline,
            status
        };
        tasks.push(newTask);
    }

    saveTasksToLocalStorage();
    closeTaskModal();
    renderApp();
}

// ลบงาน
function deleteTask(taskId) {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้ออกจากระบบ?")) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasksToLocalStorage();
        renderApp();
    }
}

// อัปเดตสถานะงานจากการลากวาง (Drag & Drop)
function updateTaskStatus(taskId, newStatus) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        saveTasksToLocalStorage();
        renderApp();
    }
}

// เลือกเรนเดอร์หน้าจอตามบทบาทผู้ใช้งาน
function renderApp() {
    // ปิดการแสดงผลทุกหน้าจอ
    document.getElementById("managerView").classList.remove("active");
    document.getElementById("memberView").classList.remove("active");

    if (currentRole === "manager") {
        document.getElementById("managerView").classList.add("active");
        renderManagerView();
    } else {
        document.getElementById("memberView").classList.add("active");
        renderMemberView();
    }
}

// ==============================================
// การเรนเดอร์ในมุมมองหัวหน้างาน (MANAGER VIEW)
// ==============================================
function renderManagerView() {
    // 1. คำนวณสถิติตัวเลขสรุป
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "done").length;
    const active = tasks.filter(t => t.status !== "done").length;
    const overdue = tasks.filter(t => isTaskOverdue(t.deadline, t.status)).length;

    // อัปเดตค่าสถิติไปแสดงใน HTML
    document.getElementById("statTotalTasks").textContent = total;
    document.getElementById("statCompletedTasks").textContent = completed;
    document.getElementById("statActiveTasks").textContent = active;
    document.getElementById("statOverdueTasks").textContent = overdue;

    // 2. เรนเดอร์กราฟวงกลมความคืบหน้า (Donut Chart)
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    document.getElementById("donutPercentText").textContent = `${percent}%`;
    
    // ตั้งค่ากราฟเส้นวงกลม (รัศมี R=60, เส้นรอบวง C = 2 * PI * R ≈ 376.99)
    const strokeDashOffset = 377 - (377 * percent) / 100;
    const valueCircle = document.getElementById("donutValueCircle");
    valueCircle.style.strokeDasharray = "377";
    valueCircle.style.strokeDashoffset = strokeDashOffset;

    // 3. เรนเดอร์กราฟแท่งภาระงานของทีม
    renderWorkloadChart();

    // 4. กรองข้อมูลตารางตามช่องค้นหาและตัวเลือกกรอง
    const searchVal = document.getElementById("searchInput").value.toLowerCase();
    const filterAss = document.getElementById("filterAssignee").value;
    const filterPri = document.getElementById("filterPriority").value;
    const filterSta = document.getElementById("filterStatus").value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchVal) || 
                              (task.desc && task.desc.toLowerCase().includes(searchVal));
        const matchesAssignee = !filterAss || task.assignee === filterAss;
        const matchesPriority = !filterPri || task.priority === filterPri;
        const matchesStatus = !filterSta || task.status === filterSta;

        return matchesSearch && matchesAssignee && matchesPriority && matchesStatus;
    });

    // วาดรายการงานในตาราง
    const tableBody = document.getElementById("taskTableBody");
    tableBody.innerHTML = "";

    if (filteredTasks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    <i class="fa-regular fa-folder-open" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    ไม่พบข้อมูลงานที่ค้นหา
                </td>
            </tr>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const tr = document.createElement("tr");
        
        // เช็คการแจ้งเตือนงานเกินกำหนด
        const isOverdue = isTaskOverdue(task.deadline, task.status);
        const isSoon = isTaskDueSoon(task.deadline, task.status);
        
        let deadlineHtml = formatThaiDate(task.deadline);
        if (isOverdue) {
            deadlineHtml = `<span class="due-alert"><i class="fa-solid fa-circle-exclamation"></i> เลยกำหนด (${formatThaiDate(task.deadline)})</span>`;
        } else if (isSoon) {
            deadlineHtml = `<span class="due-alert" style="color: var(--status-review);"><i class="fa-solid fa-clock"></i> พรุ่งนี้ (${formatThaiDate(task.deadline)})</span>`;
        }

        const initialChar = task.assignee ? task.assignee.charAt(0) : "?";

        tr.innerHTML = `
            <td>
                <div class="cell-title">${escapeHTML(task.title)}</div>
                <div class="cell-desc">${escapeHTML(task.desc || "ไม่มีรายละเอียดเพิ่มเติม")}</div>
            </td>
            <td>
                <div class="badge-assignee">
                    <div class="avatar">${initialChar}</div>
                    <span>${escapeHTML(task.assignee)}</span>
                </div>
            </td>
            <td>
                <span class="badge-priority ${task.priority}">
                    ${getThaiPriorityLabel(task.priority)}
                </span>
            </td>
            <td>
                <div class="date-text">เริ่ม: ${formatThaiDate(task.startDate)}</div>
                <div class="date-text" style="margin-top: 4px;">ส่ง: ${deadlineHtml}</div>
            </td>
            <td>
                <span class="badge-status ${task.status}">
                    ${getThaiStatusLabel(task.status)}
                </span>
            </td>
            <td style="text-align: center;">
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <button class="action-icon" onclick="openTaskModal('${task.id}')" title="แก้ไขงาน">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="action-icon delete" onclick="deleteTask('${task.id}')" title="ลบงาน">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// แสดงกราฟแท่งภาระงานของทีม
function renderWorkloadChart() {
    const chartContainer = document.getElementById("barChartContainer");
    chartContainer.innerHTML = "";

    // คำนวณจำนวนงานทั้งหมดของสมาชิกแต่ละคน
    teamMembers.forEach(member => {
        const memberTasks = tasks.filter(t => t.assignee === member);
        const total = memberTasks.length;
        const done = memberTasks.filter(t => t.status === "done").length;
        
        // ความสูงสูงสุดของกราฟคือ 150px
        const maxTasks = Math.max(...teamMembers.map(m => tasks.filter(t => t.assignee === m).length), 1);
        const barHeight = total > 0 ? (total / maxTasks) * 150 : 0;
        
        const donePercent = total > 0 ? Math.round((done / total) * 100) : 0;

        const barWrapper = document.createElement("div");
        barWrapper.className = "bar-wrapper";
        
        barWrapper.innerHTML = `
            <div class="chart-bar" style="height: ${barHeight}px;" data-val="${total} งาน" title="${member} (เสร็จแล้ว ${donePercent}%)">
                <!-- ทำไฮไลต์ความคืบหน้าภายในแท่งกราฟ -->
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: ${donePercent}%; background: var(--status-done); border-radius: 0 0 6px 6px; transition: height 1s;"></div>
            </div>
            <span class="bar-label">${member}<br><span style="font-size: 0.7rem; color: var(--text-muted);">สำเร็จ ${donePercent}%</span></span>
        `;
        chartContainer.appendChild(barWrapper);
    });
}

// ==============================================
// การเรนเดอร์ในมุมมองทีมงาน (MEMBER VIEW)
// ==============================================
function renderMemberView() {
    // เปลี่ยนหัวเรื่องของกระดาน
    document.getElementById("memberBoardTitle").textContent = currentMember;
    
    // ตั้งค่ารูปโปรไฟล์อักษรตัวแรก
    const avatarHeader = document.getElementById("memberHeaderAvatar");
    avatarHeader.textContent = currentMember.charAt(0);

    // กรองเฉพาะงานของสมาชิกคนนั้นๆ
    const memberTasks = tasks.filter(t => t.assignee === currentMember);

    // ตัวแปรสำหรับแต่ละคอลัมน์
    const columns = {
        todo: document.getElementById("cards-todo"),
        progress: document.getElementById("cards-progress"),
        review: document.getElementById("cards-review"),
        done: document.getElementById("cards-done")
    };

    // ล้างข้อมูลเก่าในการ์ดทั้งหมด
    Object.values(columns).forEach(col => col.innerHTML = "");

    // ตัวแปรเก็บจำนวนของแต่ละช่องเพื่อมาโชว์ที่หัวคอลัมน์
    const counts = { todo: 0, progress: 0, review: 0, done: 0 };

    memberTasks.forEach(task => {
        if (!columns[task.status]) return;
        
        counts[task.status]++;

        const isOverdue = isTaskOverdue(task.deadline, task.status);
        const isSoon = isTaskDueSoon(task.deadline, task.status);
        
        let deadlineHtml = formatThaiDate(task.deadline);
        let overdueClass = "";
        
        if (isOverdue) {
            deadlineHtml = `<i class="fa-solid fa-circle-exclamation"></i> เกินกำหนด`;
            overdueClass = "overdue";
        } else if (isSoon) {
            deadlineHtml = `<i class="fa-solid fa-clock"></i> ส่งวันพรุ่งนี้`;
            overdueClass = "overdue"; // ใช้สีแดง/ส้มเตือนเหมือนกัน
        }

        const card = document.createElement("div");
        card.className = "task-card";
        card.draggable = true;
        card.id = task.id;
        
        card.innerHTML = `
            <div class="card-top">
                <span class="badge-priority ${task.priority}">
                    ${getThaiPriorityLabel(task.priority)}
                </span>
                <div class="card-actions">
                    <div class="action-icon" onclick="openTaskModal('${task.id}')" title="แก้ไขงาน">
                        <i class="fa-solid fa-pen"></i>
                    </div>
                    <div class="action-icon delete" onclick="deleteTask('${task.id}')" title="ลบงาน">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                </div>
            </div>
            <h4 class="card-name">${escapeHTML(task.title)}</h4>
            <p class="card-description">${escapeHTML(task.desc || "ไม่มีรายละเอียดเพิ่ม")}</p>
            <div class="card-meta">
                <span class="meta-due ${overdueClass}">
                    ${deadlineHtml}
                </span>
                <span>${formatThaiDate(task.startDate)}</span>
            </div>
        `;

        // ตัวจับเหตุการณ์สำหรับการลาก
        card.addEventListener("dragstart", () => {
            card.classList.add("dragging");
            draggedTaskId = task.id;
        });

        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
            draggedTaskId = null;
        });

        columns[task.status].appendChild(card);
    });

    // แสดงจำนวนงานในแต่ละหัวคอลัมน์ของกระดาน
    document.getElementById("count-todo").textContent = counts.todo;
    document.getElementById("count-progress").textContent = counts.progress;
    document.getElementById("count-review").textContent = counts.review;
    document.getElementById("count-done").textContent = counts.done;

    // ถ้าแต่ละช่องไม่มีการ์ดเลย ให้ใส่ข้อความชี้แนะ
    Object.keys(columns).forEach(status => {
        if (counts[status] === 0) {
            columns[status].innerHTML = `
                <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 30px 10px; border: 1.5px dashed var(--border-color); border-radius: 12px;">
                    ไม่มีงานในช่องนี้
                </div>
            `;
        }
    });
}

// หลีกเลี่ยงปัญหาช่องโหว่ความปลอดภัยจากการกรอกข้อมูล HTML (XSS prevention)
function escapeHTML(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// รันแอปพลิเคชันเมื่อโหลดเว็บเพจเสร็จสิ้น
window.addEventListener("DOMContentLoaded", initApp);
