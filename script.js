import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


const firebaseConfig = globalThis.CAMPUSCARE_FIREBASE_CONFIG;

if (!firebaseConfig) {
    throw new Error(
        "Missing Firebase configuration. Copy firebase-config.example.js to firebase-config.js and add your project settings."
    );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Display messages on authentication forms
function showMessage(elementId, message, success = false) {
    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = message;
        element.style.color = success ? "#588157" : "#dc3545";
    }
}

// Check institutional email
function isSomaiyaEmail(email) {
    return /^[^\s@]+@somaiya\.edu$/i.test(email.trim());
}

// Student Registration
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("signupEmail").value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!isSomaiyaEmail(email)) {
            showMessage("signupMessage", "Please use your official @somaiya.edu email.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("signupMessage", "Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            showMessage("signupMessage", "Password must contain at least 8 characters.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(userCredential.user, {
                displayName: name
            });

            await sendEmailVerification(userCredential.user);

            await signOut(auth);

            signupForm.reset();

            showMessage(
                "signupMessage",
                "Account created! Please check your college email and verify your account before logging in.",
                true
            );

        } catch (error) {
            console.error("Registration error:", error);

            let message = "Registration failed. Please try again.";

            if (error.code === "auth/email-already-in-use") {
                message = "An account with this email already exists.";
            } else if (error.code === "auth/invalid-email") {
                message = "Please enter a valid email address.";
            } else if (error.code === "auth/weak-password") {
                message = "Please choose a stronger password.";
            } else if (error.code === "auth/too-many-requests") {
                message = "Too many attempts. Please try again later.";
            }

            showMessage("signupMessage", message);
        }
    });
}

// Student Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        if (!isSomaiyaEmail(email)) {
            showMessage("loginMessage", "Please use your official @somaiya.edu email.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            await userCredential.user.reload();


            if (!auth.currentUser.emailVerified) {

                // Send a fresh verification email
                await sendEmailVerification(auth.currentUser);

                // Sign out until verification is complete
                await signOut(auth);

                showMessage(
                    "loginMessage",
                    "Your account exists but is not verified. A fresh verification email has been sent. Please check your inbox."
                );

                return;
            }


            // Get the authenticated student
            const user = auth.currentUser;

            // Reference to the student's Firestore document
            const userRef = doc(db, "users", user.uid);

            // Check whether the profile already exists
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {

                // Create a new student profile
                await setDoc(userRef, {
                    uid: user.uid,
                    name: user.displayName || "",
                    email: user.email,
                    role: "student",
                    createdAt: serverTimestamp()
                });

                console.log("Student profile created!");

            } else {
                console.log("Student profile already exists!");
            }

            // Set the default role for newly registered profiles.
            let userRole = "student";

            if (!userSnapshot.exists()) {

                await setDoc(userRef, {
                    uid: user.uid,
                    name: user.displayName || "",
                    email: user.email,
                    role: "student",
                    createdAt: serverTimestamp()
                });

                console.log("Student profile created!");

            } else {

                userRole = userSnapshot.data().role;

                console.log("User profile found. Role:", userRole);
            }

            // Redirect according to the assigned role.
            showMessage(
                "loginMessage",
                "Login successful!",
                true
            );

            if (userRole === "admin") {
                window.location.replace("admin-dashboard.html");
            } else if (userRole === "recovery_officer") {
                window.location.replace("officer-dashboard.html");
            } else {
                window.location.replace("dashboard.html");
            }

            console.log("Logged in student:", user.uid);

        } catch (error) {
            console.error("Login error:", error);

            let message = "Login failed. Check your email and password.";

            if (error.code === "auth/invalid-credential") {
                message = "Incorrect email or password.";
            } else if (error.code === "auth/too-many-requests") {
                message = "Too many attempts. Please try again later.";
            }

            showMessage("loginMessage", message);
        }
    });
}


// Student Dashboard Authentication Check

const studentNameElement = document.getElementById("studentName");
const studentEmailElement = document.getElementById("studentEmail");

if (studentNameElement && studentEmailElement) {

    onAuthStateChanged(auth, async (user) => {

        if (!user || !user.emailVerified) {
            window.location.replace("login.html");
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                await signOut(auth);
                window.location.replace("login.html");
                return;
            }

            const student = userSnapshot.data();
            // Redirect users who should not access the student dashboard.
            if (student.role === "admin") {
                window.location.replace("admin-dashboard.html");
                return;
            }

            if (student.role === "recovery_officer") {
                window.location.replace("officer-dashboard.html");
                return;
            }

            studentNameElement.textContent = student.name;
            studentEmailElement.textContent = student.email;

        } catch (error) {
            console.error("Dashboard error:", error);
            studentNameElement.textContent = "Unable to load profile";
        }
    });
}

// Logout functionality

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.replace("login.html");
        } catch (error) {
            console.error("Logout error:", error);
            alert("Unable to logout. Please try again.");
        }
    });
}


// Lost and Found Report Submission

// Item Image Preview
const itemImageInput = document.getElementById("itemImage");
const imagePreview = document.getElementById("imagePreview");

if (itemImageInput && imagePreview) {

    itemImageInput.addEventListener("change", () => {

        const file = itemImageInput.files[0];

        imagePreview.src = "";
        imagePreview.style.display = "none";

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please select a JPG, PNG or WebP image.");
            itemImageInput.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Please select an image smaller than 5 MB.");
            itemImageInput.value = "";
            return;
        }

        const imageURL = URL.createObjectURL(file);

        imagePreview.src = imageURL;
        imagePreview.style.display = "block";
    });
}

// Compress item image before saving to Firestore
function compressItemImage(file) {

    return new Promise((resolve, reject) => {

        const image = new Image();
        const imageURL = URL.createObjectURL(file);

        image.onload = () => {

            const canvas = document.createElement("canvas");

            const maxSize = 800;

            let width = image.width;
            let height = image.height;

            if (width > height && width > maxSize) {
                height = Math.round(height * maxSize / width);
                width = maxSize;
            } else if (height > maxSize) {
                width = Math.round(width * maxSize / height);
                height = maxSize;
            }

            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");

            context.drawImage(image, 0, 0, width, height);

            URL.revokeObjectURL(imageURL);

            canvas.toBlob((blob) => {

                if (!blob) {
                    reject(new Error("Image compression failed."));
                    return;
                }

                if (blob.size > 500 * 1024) {
                    reject(new Error("Image is too large after compression. Please choose another image."));
                    return;
                }

                const reader = new FileReader();

                reader.onloadend = () => {
                    resolve(reader.result);
                };

                reader.onerror = () => {
                    reject(new Error("Unable to read compressed image."));
                };

                reader.readAsDataURL(blob);

            }, "image/jpeg", 0.65);
        };

        image.onerror = () => {
            URL.revokeObjectURL(imageURL);
            reject(new Error("Unable to load selected image."));
        };

        image.src = imageURL;
    });
}

const reportForm = document.getElementById("reportForm");

if (reportForm) {

    const itemDateInput = document.getElementById("itemDate");

    // Prevent selecting a future date
    itemDateInput.max = new Date().toISOString().split("T")[0];

    reportForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const user = auth.currentUser;

        if (!user || !user.emailVerified) {
            showMessage(
                "reportMessage",
                "Please log in with your verified college account."
            );
            return;
        }

        const itemType = document.getElementById("itemType").value;
        const title = document.getElementById("itemTitle").value.trim();
        const category = document.getElementById("itemCategory").value;
        const description = document.getElementById("itemDescription").value.trim();
        const location = document.getElementById("itemLocation").value.trim();
        const dateReported = itemDateInput.value;
        const selectedImage = itemImageInput.files[0];
        let imageData = null;

        if (!itemType || !title || !category ||
            !description || !location || !dateReported) {

            showMessage("reportMessage", "Please complete all fields.");
            return;
        }

        if (new Date(dateReported + "T00:00:00") > new Date()) {
            showMessage("reportMessage", "The date cannot be in the future.");
            return;
        }

        const submitButton = reportForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {

            if (selectedImage) {
                imageData = await compressItemImage(selectedImage);
            }

            await addDoc(collection(db, "items"), {
                itemType: itemType,
                title: title,
                category: category,
                description: description,
                location: location,
                dateReported: dateReported,
                imageData: imageData,
                ownerUid: user.uid,
                status: "open",
                createdAt: serverTimestamp()
            });

            reportForm.reset();

            showMessage(
                "reportMessage",
                "Your report has been submitted successfully!",
                true
            );

        } catch (error) {

            console.error("Report submission error:", error);

            showMessage(
                "reportMessage",
                error.message === "Image is too large after compression. Please choose another image."
                    ? error.message
                    : "Unable to submit your report. Please try again."
            );

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Submit Report";

        }
    });
}


// Browse Lost and Found Items

const itemsContainer = document.getElementById("itemsContainer");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const itemsMessage = document.getElementById("itemsMessage");

if (itemsContainer) {

    let allItems = [];
    let currentUserRole = "";

    onAuthStateChanged(auth, async (user) => {

        if (!user || !user.emailVerified) {
            window.location.replace("login.html");
            return;
        }

        try {

            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                await signOut(auth);
                window.location.replace("login.html");
                return;
            }

            // Get the user's role from Firestore.
            currentUserRole = userSnapshot.data().role;

            await loadItems();

        } catch (error) {

            console.error("Loading items error:", error);
            itemsMessage.textContent = "Unable to load items.";

        }
    });

    async function loadItems() {

        itemsMessage.textContent = "Loading items...";

        try {

            const itemsQuery = query(
                collection(db, "items"),
                where("status", "==", "open"),
                orderBy("createdAt", "desc")
            );

            const snapshot = await getDocs(itemsQuery);

            allItems = snapshot.docs.map(document => ({
                id: document.id,
                ...document.data()
            }));

            displayItems();

        } catch (error) {

            console.error("Firestore error:", error);
            itemsMessage.textContent =
                "Unable to load reports. Please check your connection.";

        }
    }

    function displayItems() {

        itemsContainer.innerHTML = "";

        const selectedType = typeFilter.value;
        const selectedCategory = categoryFilter.value;

        const filteredItems = allItems.filter(item => {

            const matchesType =
                selectedType === "all" || item.itemType === selectedType;

            const matchesCategory =
                selectedCategory === "all" ||
                item.category === selectedCategory;

            return matchesType && matchesCategory;

        });

        if (filteredItems.length === 0) {

            itemsMessage.textContent = "No matching reports found.";
            return;

        }

        itemsMessage.textContent =
            `${filteredItems.length} report(s) found.`;

        filteredItems.forEach(item => {

            const column = document.createElement("div");
            column.className = "col-md-6 col-lg-4";

            const card = document.createElement("div");
            card.className = "info-card";

            const badge = document.createElement("span");
            badge.className = "badge mb-3 " +
                (item.itemType === "lost" ? "bg-danger" : "bg-success");

            badge.textContent =
                item.itemType === "lost" ? "LOST ITEM" : "FOUND ITEM";

            // Display uploaded item image
            if (item.imageData) {
                const itemImage = document.createElement("img");

                itemImage.src = item.imageData;
                itemImage.alt = item.title;
                itemImage.className = "img-fluid rounded mb-3";

                itemImage.style.width = "100%";
                itemImage.style.height = "180px";
                itemImage.style.objectFit = "cover";

                card.appendChild(itemImage);
            }

            const title = document.createElement("h3");
            title.textContent = item.title;

            const category = document.createElement("p");
            category.textContent = "Category: " + item.category;

            const description = document.createElement("p");
            description.textContent = item.description;

            const location = document.createElement("p");
            location.textContent = "Location: " + item.location;

            const date = document.createElement("p");
            date.textContent = "Date: " + item.dateReported;


            if (
                item.itemType === "found" &&
                currentUserRole === "student"
            ) {

                const claimButton = document.createElement("a");

                claimButton.href =
                    `claim-item.html?itemId=${encodeURIComponent(item.id)}`;

                claimButton.className = "btn btn-outline-primary mt-2";
                claimButton.textContent = "Claim This Item";

                card.append(
                    badge,
                    title,
                    category,
                    description,
                    location,
                    date,
                    claimButton
                );

            } else {

                card.append(
                    badge,
                    title,
                    category,
                    description,
                    location,
                    date
                );

            }


            column.appendChild(card);
            itemsContainer.appendChild(column);

        });
    }

    typeFilter.addEventListener("change", displayItems);
    categoryFilter.addEventListener("change", displayItems);

}


// Claim Submission

const claimForm = document.getElementById("claimForm");

if (claimForm) {

    const params = new URLSearchParams(window.location.search);
    const itemId = params.get("itemId");

    const itemDetails = document.getElementById("claimItemDetails");

    let selectedItem = null;
    let currentStudent = null;

    onAuthStateChanged(auth, async (user) => {

        if (!user || !user.emailVerified) {
            window.location.replace("login.html");
            return;
        }

        try {

            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                await signOut(auth);
                window.location.replace("login.html");
                return;
            }

            currentStudent = user;

            if (!itemId) {
                itemDetails.textContent = "No item selected.";
                claimForm.hidden = true;
                return;
            }

            const itemRef = doc(db, "items", itemId);
            const itemSnapshot = await getDoc(itemRef);

            if (!itemSnapshot.exists()) {
                itemDetails.textContent = "Item not found.";
                claimForm.hidden = true;
                return;
            }

            selectedItem = itemSnapshot.data();

            if (
                selectedItem.itemType !== "found" ||
                selectedItem.status !== "open" ||
                selectedItem.ownerUid === user.uid
            ) {
                itemDetails.textContent =
                    "This item cannot be claimed.";
                claimForm.hidden = true;
                return;
            }

            itemDetails.innerHTML = "";

            const heading = document.createElement("h5");
            heading.textContent = selectedItem.title;

            const category = document.createElement("p");
            category.textContent = "Category: " + selectedItem.category;

            const location = document.createElement("p");
            location.textContent = "Location: " + selectedItem.location;

            itemDetails.append(heading, category, location);

        } catch (error) {

            console.error("Claim page error:", error);
            itemDetails.textContent = "Unable to load item details.";
            claimForm.hidden = true;

        }
    });

    claimForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!currentStudent || !selectedItem) {
            showMessage("claimMessage", "Please wait for item details to load.");
            return;
        }

        const reason = document.getElementById("claimReason").value.trim();

        const evidence = document
            .getElementById("ownershipEvidence").value.trim();

        if (!reason) {
            showMessage("claimMessage", "Please explain why this item belongs to you.");
            return;
        }

        const submitButton =
            claimForm.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {

            await addDoc(collection(db, "claims"), {

                itemId: itemId,
                claimantUid: currentStudent.uid,
                reason: reason,
                evidence: evidence,
                status: "pending",
                createdAt: serverTimestamp()

            });

            claimForm.reset();

            showMessage(
                "claimMessage",
                "Your claim has been submitted successfully!",
                true
            );

            submitButton.textContent = "Claim Submitted";

        } catch (error) {

            console.error("Claim submission error:", error);

            showMessage(
                "claimMessage",
                "Unable to submit your claim. Please try again."
            );

            submitButton.disabled = false;
            submitButton.textContent = "Submit Claim";

        }

    });
}


// My Claims

const claimsContainer = document.getElementById("claimsContainer");
const claimsMessage = document.getElementById("claimsMessage");

if (claimsContainer) {

    onAuthStateChanged(auth, async (user) => {

        if (!user || !user.emailVerified) {
            window.location.replace("login.html");
            return;
        }

        try {

            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                await signOut(auth);
                window.location.replace("login.html");
                return;
            }

            await loadMyClaims(user.uid);

        } catch (error) {

            console.error("My Claims error:", error);
            claimsMessage.textContent =
                "Unable to load your claims. Please try again.";

        }
    });

    async function loadMyClaims(userId) {

        claimsMessage.textContent = "Loading your claims...";

        try {

            const claimsQuery = query(
                collection(db, "claims"),
                where("claimantUid", "==", userId)
            );

            const snapshot = await getDocs(claimsQuery);

            claimsContainer.innerHTML = "";

            if (snapshot.empty) {
                claimsMessage.textContent =
                    "You haven't submitted any claims yet.";
                return;
            }

            const claims = snapshot.docs.map(document => ({
                id: document.id,
                ...document.data()
            }));

            // Sort newest first without requiring another index.
            claims.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });

            claimsMessage.textContent =
                `${claims.length} claim(s) submitted.`;

            for (const claim of claims) {

                const column = document.createElement("div");
                column.className = "col-md-6 col-lg-4";

                const card = document.createElement("div");
                card.className = "info-card";

                const title = document.createElement("h4");
                title.textContent = "Claimed Item";

                const status = document.createElement("span");

                if (claim.status === "approved") {
                    status.className = "badge bg-success mb-3";
                } else if (claim.status === "rejected") {
                    status.className = "badge bg-danger mb-3";
                } else {
                    status.className = "badge bg-warning text-dark mb-3";
                }

                status.textContent = claim.status.toUpperCase();

                const reason = document.createElement("p");
                reason.textContent = "Reason: " + claim.reason;

                const item = await getDoc(
                    doc(db, "items", claim.itemId)
                );

                const itemTitle = document.createElement("p");

                itemTitle.textContent = item.exists()
                    ? "Item: " + item.data().title
                    : "Item details unavailable";

                const date = document.createElement("p");
                date.textContent = claim.createdAt
                    ? "Submitted: " +
                    claim.createdAt.toDate().toLocaleDateString()
                    : "Submission date unavailable";

                card.append(title, status, itemTitle, reason, date);
                column.appendChild(card);
                claimsContainer.appendChild(column);
            }

        } catch (error) {

            console.error("Claims loading error:", error);

            claimsMessage.textContent =
                "Unable to load your claims. Check the console for details.";

        }
    }
}


// My Reports

const myReportsContainer =
    document.getElementById("myReportsContainer");

const myReportsMessage =
    document.getElementById("myReportsMessage");

if (myReportsContainer) {

    onAuthStateChanged(auth, async (user) => {

        if (!user || !user.emailVerified) {
            window.location.replace("login.html");
            return;
        }

        try {

            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                await signOut(auth);
                window.location.replace("login.html");
                return;
            }

            const reportsQuery = query(
                collection(db, "items"),
                where("ownerUid", "==", user.uid)
            );

            const snapshot = await getDocs(reportsQuery);

            myReportsContainer.innerHTML = "";

            if (snapshot.empty) {
                myReportsMessage.textContent =
                    "You haven't submitted any reports yet.";
                return;
            }

            const reports = snapshot.docs.map(docSnapshot => ({
                id: docSnapshot.id,
                ...docSnapshot.data()
            }));

            reports.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });

            myReportsMessage.textContent =
                `${reports.length} report(s) submitted.`;

            reports.forEach(item => {

                const column = document.createElement("div");
                column.className = "col-md-6 col-lg-4";

                const card = document.createElement("div");
                card.className = "info-card";

                // Display uploaded item image
                if (item.imageData) {
                    const itemImage = document.createElement("img");

                    itemImage.src = item.imageData;
                    itemImage.alt = item.title;
                    itemImage.className = "img-fluid rounded mb-3";

                    itemImage.style.width = "100%";
                    itemImage.style.height = "180px";
                    itemImage.style.objectFit = "cover";

                    card.appendChild(itemImage);
                }

                const type = document.createElement("span");
                type.className = "badge mb-3 " +
                    (item.itemType === "lost"
                        ? "bg-danger"
                        : "bg-success");

                type.textContent = item.itemType.toUpperCase();

                const title = document.createElement("h4");
                title.textContent = item.title;

                const category = document.createElement("p");
                category.textContent = "Category: " + item.category;

                const location = document.createElement("p");
                location.textContent = "Location: " + item.location;

                const date = document.createElement("p");
                date.textContent = "Date: " + item.dateReported;

                const status = document.createElement("span");
                status.className = "badge bg-secondary";
                status.textContent = item.status.toUpperCase();

                card.append(
                    type,
                    title,
                    category,
                    location,
                    date,
                    status
                );

                column.appendChild(card);
                myReportsContainer.appendChild(column);

            });

        } catch (error) {

            console.error("My Reports error:", error);

            myReportsMessage.textContent =
                "Unable to load your reports. Please try again.";

        }
    });
}


// Admin Dashboard Authentication Check

const adminNameElement = document.getElementById("adminName");
const adminEmailElement = document.getElementById("adminEmail");

if (adminNameElement && adminEmailElement) {

    onAuthStateChanged(auth, async (user) => {

        if (!user || !user.emailVerified) {
            window.location.replace("login.html");
            return;
        }

        try {

            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                window.location.replace("login.html");
                return;
            }

            const admin = userSnapshot.data();

            if (admin.role !== "admin") {

                if (admin.role === "recovery_officer") {
                    window.location.replace("officer-dashboard.html");
                } else {
                    window.location.replace("dashboard.html");
                }

                return;
            }

            adminNameElement.textContent = admin.name || "Admin";
            adminEmailElement.textContent = admin.email;

            // Load Admin Dashboard Statistics
            await loadAdminStatistics();

        } catch (error) {

            console.error("Admin dashboard error:", error);
            adminNameElement.textContent = "Unable to load profile";

        }
    });

    async function loadAdminStatistics() {

        try {

            // Get all reported items.
            const itemsSnapshot = await getDocs(
                collection(db, "items")
            );

            // Get all submitted claims.
            const claimsSnapshot = await getDocs(
                collection(db, "claims")
            );

            const items = itemsSnapshot.docs.map(document =>
                document.data()
            );

            const claims = claimsSnapshot.docs.map(document =>
                document.data()
            );

            const totalReports = items.length;

            const pendingClaims = claims.filter(
                claim => claim.status === "pending"
            ).length;

            const recoveredItems = items.filter(
                item => item.status === "recovered"
            ).length;

            const openReports = items.filter(
                item => item.status === "open"
            ).length;

            // Get all registered user accounts.
            const usersSnapshot = await getDocs(
                collection(db, "users")
            );

            const totalUsers = usersSnapshot.size;

            document.getElementById("totalReports").textContent =
                totalReports;

            document.getElementById("pendingClaims").textContent =
                pendingClaims;

            document.getElementById("recoveredItems").textContent =
                recoveredItems;

            document.getElementById("openReports").textContent =
                openReports;

            document.getElementById("totalUsers").textContent =
                totalUsers;

        } catch (error) {

            console.error("Statistics loading error:", error);

        }
    }
}


// Recovery Officer Dashboard Authentication Check

const officerNameElement = document.getElementById("officerName");
const officerEmailElement = document.getElementById("officerEmail");

if (officerNameElement && officerEmailElement) {

    onAuthStateChanged(auth, async (user) => {

        if (!user || !user.emailVerified) {
            window.location.replace("login.html");
            return;
        }

        try {

            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                window.location.replace("login.html");
                return;
            }

            const officer = userSnapshot.data();

            if (officer.role !== "recovery_officer") {

                if (officer.role === "admin") {
                    window.location.replace("admin-dashboard.html");
                } else {
                    window.location.replace("dashboard.html");
                }

                return;
            }

            officerNameElement.textContent = officer.name || "Officer";
            officerEmailElement.textContent = officer.email;

            await loadOfficerStatistics();

        } catch (error) {

            console.error("Officer dashboard error:", error);
            officerNameElement.textContent = "Unable to load profile";

        }
    });

    async function loadOfficerStatistics() {

        try {

            const itemsSnapshot = await getDocs(
                collection(db, "items")
            );

            const claimsSnapshot = await getDocs(
                collection(db, "claims")
            );

            const items = itemsSnapshot.docs.map(document =>
                document.data()
            );

            const claims = claimsSnapshot.docs.map(document =>
                document.data()
            );

            document.getElementById("totalReports").textContent =
                items.length;

            document.getElementById("pendingClaims").textContent =
                claims.filter(claim => claim.status === "pending").length;

            document.getElementById("recoveredItems").textContent =
                items.filter(item => item.status === "recovered").length;

            document.getElementById("openReports").textContent =
                items.filter(item => item.status === "open").length;

        } catch (error) {

            console.error("Officer statistics error:", error);

        }
    }
}


// Manage Claims - Admin and Recovery Officer

const manageClaimsContainer =
    document.getElementById("manageClaimsContainer");

const manageClaimsMessage =
    document.getElementById("claimsMessage");

const claimStatusFilter =
    document.getElementById("claimStatusFilter");

const staffEmailElement =
    document.getElementById("staffEmail");

if (manageClaimsContainer) {

    let allClaims = [];

    onAuthStateChanged(auth, async (user) => {

        if (!user || !user.emailVerified) {
            window.location.replace("login.html");
            return;
        }

        try {

            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                window.location.replace("login.html");
                return;
            }

            const staff = userSnapshot.data();

            if (
                staff.role !== "admin" &&
                staff.role !== "recovery_officer"
            ) {
                window.location.replace("dashboard.html");
                return;
            }

            staffEmailElement.textContent = staff.email;

            await loadAllClaims();

        } catch (error) {

            console.error("Manage claims error:", error);

            manageClaimsMessage.textContent =
                "Unable to load claims. Please try again.";

        }
    });

    async function loadAllClaims() {

        manageClaimsMessage.textContent = "Loading claims...";

        try {

            const claimsQuery = query(
                collection(db, "claims")
            );

            const snapshot = await getDocs(claimsQuery);

            allClaims = [];

            for (const claimDocument of snapshot.docs) {

                const claim = {
                    id: claimDocument.id,
                    ...claimDocument.data()
                };

                const itemSnapshot = await getDoc(
                    doc(db, "items", claim.itemId)
                );

                claim.itemTitle = itemSnapshot.exists()
                    ? itemSnapshot.data().title
                    : "Item details unavailable";

                allClaims.push(claim);
            }

            allClaims.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;

                return timeB - timeA;
            });

            displayAllClaims();

        } catch (error) {

            console.error("Claims loading error:", error);

            manageClaimsMessage.textContent =
                "Unable to load claims. Check the console for details.";

        }
    }

    function displayAllClaims() {

        manageClaimsContainer.innerHTML = "";

        const selectedStatus = claimStatusFilter.value;

        const filteredClaims = allClaims.filter(claim => {
            return selectedStatus === "all" ||
                claim.status === selectedStatus;
        });

        if (filteredClaims.length === 0) {

            manageClaimsMessage.textContent =
                "No claims found for this status.";

            return;
        }

        manageClaimsMessage.textContent =
            `${filteredClaims.length} claim(s) found.`;

        filteredClaims.forEach(claim => {

            const column = document.createElement("div");
            column.className = "col-md-6 col-lg-4";

            const card = document.createElement("div");
            card.className = "info-card";

            const title = document.createElement("h4");
            title.textContent = claim.itemTitle;

            const status = document.createElement("span");
            status.className = "badge mb-3 bg-warning text-dark";
            status.textContent = claim.status.toUpperCase();

            const reason = document.createElement("p");
            reason.textContent = "Claim Reason: " + claim.reason;

            const evidence = document.createElement("p");
            evidence.textContent =
                "Ownership Evidence: " +
                (claim.evidence || "Not provided");

            const claimant = document.createElement("p");
            claimant.textContent =
                "Claimant UID: " + claim.claimantUid;

            const date = document.createElement("p");
            date.textContent = claim.createdAt
                ? "Submitted: " +
                claim.createdAt.toDate().toLocaleDateString()
                : "Date unavailable";

            card.append(
                title,
                status,
                reason,
                evidence,
                claimant,
                date
            );

            // Show decision buttons only for pending claims.
            if (claim.status === "pending") {

                const buttonGroup = document.createElement("div");
                buttonGroup.className = "d-flex gap-2 mt-3";

                const approveButton = document.createElement("button");
                approveButton.className = "btn btn-success";
                approveButton.textContent = "Approve";

                const rejectButton = document.createElement("button");
                rejectButton.className = "btn btn-danger";
                rejectButton.textContent = "Reject";

                approveButton.addEventListener("click", () => {
                    updateClaimStatus(claim.id, "approved", approveButton, rejectButton);
                });

                rejectButton.addEventListener("click", () => {
                    updateClaimStatus(claim.id, "rejected", approveButton, rejectButton);
                });

                buttonGroup.append(approveButton, rejectButton);
                card.appendChild(buttonGroup);
            }

            column.appendChild(card);
            manageClaimsContainer.appendChild(column);

        });
    }

    claimStatusFilter.addEventListener("change", displayAllClaims);

    async function updateClaimStatus(claimId, newStatus, approveButton, rejectButton) {

        const confirmDecision = confirm(
            `Are you sure you want to ${newStatus} this claim?`
        );

        if (!confirmDecision) {
            return;
        }

        approveButton.disabled = true;
        rejectButton.disabled = true;

        try {

            const claimRef = doc(db, "claims", claimId);

            await updateDoc(claimRef, {
                status: newStatus,
                reviewedBy: auth.currentUser.uid,
                reviewedAt: serverTimestamp()
            });

            alert(`Claim ${newStatus} successfully!`);

            // Refresh the claims list.
            await loadAllClaims();

        } catch (error) {

            console.error("Claim decision error:", error);

            alert("Unable to update claim. Please try again.");

            approveButton.disabled = false;
            rejectButton.disabled = false;

        }
    }
}


// Manage Items - Admin and Recovery Officer

const manageItemsContainer =
    document.getElementById("manageItemsContainer");

const manageItemsMessage =
    document.getElementById("manageItemsMessage");

const itemTypeFilter =
    document.getElementById("itemTypeFilter");

const itemStatusFilter =
    document.getElementById("itemStatusFilter");

const manageItemsStaffEmail =
    document.getElementById("staffEmail");

if (manageItemsContainer) {

    let allManagedItems = [];

    onAuthStateChanged(auth, async (user) => {

        if (!user || !user.emailVerified) {
            window.location.replace("login.html");
            return;
        }

        try {

            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) {
                window.location.replace("login.html");
                return;
            }

            const staff = userSnapshot.data();

            if (
                staff.role !== "admin" &&
                staff.role !== "recovery_officer"
            ) {
                window.location.replace("dashboard.html");
                return;
            }

            manageItemsStaffEmail.textContent = staff.email;

            await loadAllManagedItems();

        } catch (error) {

            console.error("Manage items error:", error);

            manageItemsMessage.textContent =
                "Unable to load items. Please try again.";

        }
    });

    async function loadAllManagedItems() {

        manageItemsMessage.textContent = "Loading reported items...";

        try {

            const itemsSnapshot = await getDocs(
                collection(db, "items")
            );

            allManagedItems = itemsSnapshot.docs.map(document => ({
                id: document.id,
                ...document.data()
            }));

            allManagedItems.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;

                return timeB - timeA;
            });

            displayManagedItems();

        } catch (error) {

            console.error("Items loading error:", error);

            manageItemsMessage.textContent =
                "Unable to load reported items.";

        }
    }

    function displayManagedItems() {

        manageItemsContainer.innerHTML = "";

        const selectedType = itemTypeFilter.value;
        const selectedStatus = itemStatusFilter.value;

        const filteredItems = allManagedItems.filter(item => {

            const matchesType =
                selectedType === "all" ||
                item.itemType === selectedType;

            const matchesStatus =
                selectedStatus === "all" ||
                item.status === selectedStatus;

            return matchesType && matchesStatus;

        });

        if (filteredItems.length === 0) {

            manageItemsMessage.textContent = "No matching items found.";
            return;
        }

        manageItemsMessage.textContent =
            `${filteredItems.length} item(s) found.`;

        filteredItems.forEach(item => {

            const column = document.createElement("div");
            column.className = "col-md-6 col-lg-4";

            const card = document.createElement("div");
            card.className = "info-card";

            // Display uploaded item image
            if (item.imageData) {
                const itemImage = document.createElement("img");

                itemImage.src = item.imageData;
                itemImage.alt = item.title;
                itemImage.className = "img-fluid rounded mb-3";

                itemImage.style.width = "100%";
                itemImage.style.height = "180px";
                itemImage.style.objectFit = "cover";

                card.appendChild(itemImage);
            }

            const type = document.createElement("span");
            type.className = "badge mb-3 " +
                (item.itemType === "lost" ? "bg-danger" : "bg-success");

            type.textContent = item.itemType.toUpperCase();

            const title = document.createElement("h4");
            title.textContent = item.title;

            const category = document.createElement("p");
            category.textContent = "Category: " + item.category;

            const description = document.createElement("p");
            description.textContent = item.description;

            const location = document.createElement("p");
            location.textContent = "Location: " + item.location;

            const date = document.createElement("p");
            date.textContent = "Reported: " + item.dateReported;

            const status = document.createElement("span");
            status.className = "badge bg-secondary";
            status.textContent = item.status.toUpperCase();

            const owner = document.createElement("p");
            owner.className = "small text-muted mt-2";
            owner.textContent = "Reported by UID: " + item.ownerUid;

            card.append(
                type,
                title,
                category,
                description,
                location,
                date,
                status,
                owner
            );

            // Show status controls only for open items.
            if (item.status === "open") {

                const buttonGroup = document.createElement("div");
                buttonGroup.className = "d-flex gap-2 mt-3";

                const recoveredButton = document.createElement("button");
                recoveredButton.className = "btn btn-success";
                recoveredButton.textContent = "Mark Recovered";

                const closedButton = document.createElement("button");
                closedButton.className = "btn btn-outline-danger";
                closedButton.textContent = "Close Report";

                recoveredButton.addEventListener("click", () => {
                    updateItemStatus(item.id, "recovered", recoveredButton, closedButton);
                });

                closedButton.addEventListener("click", () => {
                    updateItemStatus(item.id, "closed", recoveredButton, closedButton);
                });

                buttonGroup.append(recoveredButton, closedButton);
                card.appendChild(buttonGroup);
            }

            column.appendChild(card);
            manageItemsContainer.appendChild(column);

        });
    }

    itemTypeFilter.addEventListener("change", displayManagedItems);
    itemStatusFilter.addEventListener("change", displayManagedItems);

    async function updateItemStatus(itemId, newStatus, recoveredButton, closedButton) {

        const confirmed = confirm(
            `Are you sure you want to mark this item as ${newStatus}?`
        );

        if (!confirmed) {
            return;
        }

        recoveredButton.disabled = true;
        closedButton.disabled = true;

        try {

            const itemRef = doc(db, "items", itemId);

            await updateDoc(itemRef, {
                status: newStatus
            });

            alert(`Item marked as ${newStatus} successfully!`);

            await loadAllManagedItems();

        } catch (error) {

            console.error("Item status update error:", error);

            alert("Unable to update item status. Please try again.");

            recoveredButton.disabled = false;
            closedButton.disabled = false;
        }
    }

}


// Recovery Records - Admin and Recovery Officer

const recoveryRecordsContainer =
    document.getElementById("recoveryRecordsContainer");

const recoveryMessage =
    document.getElementById("recoveryMessage");

const recoveryTypeFilter =
    document.getElementById("recoveryTypeFilter");

const recoveryStaffEmail =
    document.getElementById("recoveryStaffEmail");

if (recoveryRecordsContainer) {

    let allRecoveredItems = [];

    onAuthStateChanged(auth, async (user) => {

        if (!user || !user.emailVerified) {
            window.location.replace("login.html");
            return;
        }

        try {

            const userSnapshot = await getDoc(
                doc(db, "users", user.uid)
            );

            if (!userSnapshot.exists()) {
                window.location.replace("login.html");
                return;
            }

            const staff = userSnapshot.data();

            if (
                staff.role !== "admin" &&
                staff.role !== "recovery_officer"
            ) {
                window.location.replace("dashboard.html");
                return;
            }

            recoveryStaffEmail.textContent = staff.email;

            await loadRecoveryRecords();

        } catch (error) {

            console.error("Recovery records error:", error);

            recoveryMessage.textContent =
                "Unable to load recovery records.";

        }
    });

    async function loadRecoveryRecords() {

        recoveryMessage.textContent = "Loading recovery records...";

        try {

            const itemsSnapshot = await getDocs(
                query(
                    collection(db, "items"),
                    where("status", "==", "recovered")
                )
            );

            allRecoveredItems = itemsSnapshot.docs.map(document => ({
                id: document.id,
                ...document.data()
            }));

            allRecoveredItems.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });

            displayRecoveryRecords();

        } catch (error) {

            console.error("Recovery loading error:", error);

            recoveryMessage.textContent =
                "Unable to load recovery records.";

        }
    }

    function displayRecoveryRecords() {

        recoveryRecordsContainer.innerHTML = "";

        const selectedType = recoveryTypeFilter.value;

        const filteredItems = allRecoveredItems.filter(item =>
            selectedType === "all" || item.itemType === selectedType
        );

        if (filteredItems.length === 0) {
            recoveryMessage.textContent = "No recovered items found.";
            return;
        }

        recoveryMessage.textContent =
            `${filteredItems.length} recovered item(s) found.`;

        filteredItems.forEach(item => {

            const column = document.createElement("div");
            column.className = "col-md-6 col-lg-4";

            const card = document.createElement("div");
            card.className = "info-card";

            // Display uploaded item image
            if (item.imageData) {
                const itemImage = document.createElement("img");

                itemImage.src = item.imageData;
                itemImage.alt = item.title;
                itemImage.className = "img-fluid rounded mb-3";

                itemImage.style.width = "100%";
                itemImage.style.height = "180px";
                itemImage.style.objectFit = "cover";

                card.appendChild(itemImage);
            }

            const type = document.createElement("span");
            type.className = "badge mb-3 bg-success";
            type.textContent = item.itemType.toUpperCase();

            const title = document.createElement("h4");
            title.textContent = item.title;

            const category = document.createElement("p");
            category.textContent = "Category: " + item.category;

            const location = document.createElement("p");
            location.textContent = "Location: " + item.location;

            const date = document.createElement("p");
            date.textContent = "Reported: " + item.dateReported;

            const status = document.createElement("span");
            status.className = "badge bg-success";
            status.textContent = "RECOVERED";

            card.append(type, title, category, location, date, status);

            column.appendChild(card);
            recoveryRecordsContainer.appendChild(column);

        });
    }

    recoveryTypeFilter.addEventListener(
        "change",
        displayRecoveryRecords
    );
}


// ==========================================
// MANAGE USERS PAGE - ADMIN ONLY
// ==========================================

if (document.getElementById("usersContainer")) {

    const usersContainer = document.getElementById("usersContainer");
    const usersMessage = document.getElementById("usersMessage");
    const userSearch = document.getElementById("userSearch");

    let allUsers = [];

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            window.location.replace("login.html");
            return;
        }

        try {
            if (!user.emailVerified) {
                window.location.replace("login.html");
                return;
            }

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                window.location.replace("login.html");
                return;
            }

            const role = userSnap.data().role;

            if (role !== "admin") {
                if (role === "recovery_officer") {
                    window.location.replace("officer-dashboard.html");
                } else {
                    window.location.replace("dashboard.html");
                }
                return;
            }

            await loadUsers();

        } catch (error) {
            console.error("Access check error:", error);
            usersMessage.textContent = "Unable to load user accounts.";
        }
    });

    async function loadUsers() {

        usersMessage.textContent = "Loading user accounts...";

        try {
            const usersSnapshot = await getDocs(collection(db, "users"));

            allUsers = [];

            usersSnapshot.forEach((userDoc) => {
                allUsers.push(userDoc.data());
            });

            displayUsers(allUsers);

        } catch (error) {
            console.error("Error loading users:", error);
            usersMessage.textContent = "Failed to load user accounts.";
        }
    }

    function displayUsers(users) {

        usersContainer.innerHTML = "";

        if (users.length === 0) {
            usersMessage.textContent = "No user accounts found.";
            return;
        }

        usersMessage.textContent = `Total accounts: ${users.length}`;

        users.forEach((user) => {

            let registeredDate = "Not available";

            if (user.createdAt && user.createdAt.toDate) {
                registeredDate = user.createdAt.toDate().toLocaleDateString("en-IN");
            }

            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = user.name || "N/A";

            const emailCell = document.createElement("td");
            emailCell.textContent = user.email || "N/A";

            const roleCell = document.createElement("td");
            roleCell.textContent = user.role || "student";

            const dateCell = document.createElement("td");
            dateCell.textContent = registeredDate;

            row.append(nameCell, emailCell, roleCell, dateCell);
            usersContainer.appendChild(row);
        });
    }

    const roleFilter = document.getElementById("roleFilter");

    function applyUserFilters() {

        const searchText = userSearch.value.toLowerCase().trim();
        const selectedRole = roleFilter.value;

        const filteredUsers = allUsers.filter((user) => {

            const name = (user.name || "").toLowerCase();
            const email = (user.email || "").toLowerCase();

            const matchesSearch =
                name.includes(searchText) ||
                email.includes(searchText);

            const matchesRole =
                selectedRole === "all" ||
                user.role === selectedRole;

            return matchesSearch && matchesRole;
        });

        displayUsers(filteredUsers);
    }

    userSearch.addEventListener("input", applyUserFilters);
    roleFilter.addEventListener("change", applyUserFilters);
}

