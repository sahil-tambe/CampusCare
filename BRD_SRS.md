# CAMPUSCARE
## College Lost & Found Management System
### Business Requirements Document (BRD) and Software Requirements Specification (SRS)

**Version:** 1.1  
**Project type:** MCA Academic Project  
**Application type:** Responsive Web Application  
**Development approach:** HTML, CSS, JavaScript and Bootstrap  
**Backend:** Firebase  
**Database:** Cloud Firestore  
**Authentication:** Firebase Authentication  
**Storage:** Firebase Storage  
**Hosting:** Firebase Hosting  
**Status:** Requirements Finalization

---

# PART 1 – BUSINESS REQUIREMENTS DOCUMENT (BRD)

## 1. Introduction

CampusCare is a centralized web-based Lost and Found Management System developed for colleges and educational institutions.

The platform enables students, faculty members and authorized college staff to report lost and found belongings, identify potential matches, verify ownership and coordinate safe item recovery.

Instead of relying on informal communication channels such as WhatsApp groups, notice boards or word of mouth, CampusCare provides a single platform for managing the entire recovery process.

The platform focuses on three major principles:

1. Trust – Only genuine institutional users should be able to participate.
2. Privacy – Personal information and ownership evidence must be protected.
3. Accountability – Every important action, especially item handover, must be recorded.

## 2. Problem Statement

Students frequently lose personal belongings within college campuses. The existing recovery process is usually informal and lacks a centralized reporting mechanism.

Major problems include:

- Students do not know where to report lost belongings.
- Found items are not easily discoverable.
- Students may not know whether someone has already found their belongings.
- WhatsApp messages and notices get lost among other communications.
- Anyone could falsely claim ownership of an item.
- Finders may hesitate to return valuable belongings to strangers.
- No proper record exists of the person who received an item.
- Personal contact information may be exposed unnecessarily.

CampusCare aims to address these issues through a simple, secure and accountable digital platform.

## 3. Project Objectives

- Provide a centralized platform for lost and found reporting.
- Allow students to search for found items.
- Allow finders to report items they have discovered.
- Suggest potential matches between lost and found reports.
- Introduce ownership verification before recovery.
- Provide a safe and documented handover process.
- Protect personal information.
- Provide an administrative dashboard for college authorities.
- Reduce the manual effort involved in handling lost-and-found cases.

## 4. Project Scope

### 4.1 In Scope

The first version will include:

- Student and staff registration.
- Email verification.
- Login and logout.
- User dashboard.
- Lost-item reporting.
- Found-item reporting.
- Item image upload.
- Search and category filters.
- Potential lost/found matching.
- Claim submission.
- Ownership verification.
- Admin approval for sensitive cases.
- Direct and college-office handover.
- Handover confirmation.
- Optional reward declaration.
- Notifications.
- Report management.
- Basic analytics.
- User and item management.

### 4.2 Out of Scope

The following features will not be implemented in the initial version:

- Mobile application.
- Online reward payments.
- Mandatory collateral or security deposits.
- Automatic compensation for lost property.
- AI-based image recognition.
- Advanced chatbot.
- Real-time GPS tracking.
- Courier services.
- Public registration without college verification.
- Multi-college SaaS management.
- Complex reputation and ranking systems.
- Automated legal ownership determination.

## 5. Stakeholders

### 5.1 Student

A registered college student who can:
- Report lost items.
- Report found items.
- Search listings.
- Submit ownership claims.
- Respond to claim requests.
- Confirm successful recovery.
- Report suspicious behaviour.

A student can be both an owner and a finder.

### 5.2 Finder

A person who discovers an item and reports it.

Responsibilities:
- Provide accurate item information.
- Keep the item safe while retaining temporary custody.
- Submit the item to the college office when required.
- Cooperate with ownership verification.
- Confirm the handover.

### 5.3 Item Owner

A person who believes that a listed found item belongs to them.

Responsibilities:
- Provide accurate information.
- Submit reasonable proof of ownership.
- Attend the agreed handover.
- Confirm receipt.

### 5.4 Administrator

An authorized college representative who:
- Manages user accounts.
- Reviews sensitive claims.
- Handles disputes.
- Manages reported listings.
- Assigns recovery officers.
- Monitors handovers.
- Views reports and analytics.

### 5.5 Recovery Officer

An authorized staff member responsible for physical recovery operations.

Responsibilities:
- Receive items.
- Record custody.
- Store items safely.
- Verify claimants when required.
- Release items to approved owners.
- Maintain handover records.

## 6. Business Workflow

### 6.1 Lost Item Workflow

1. Student logs into CampusCare.
2. Student selects Report Lost Item.
3. Student enters item details.
4. Student submits the report.
5. The system creates a unique report ID.
6. The system checks existing found-item records.
7. Potential matches are displayed.
8. Student can initiate a claim against a matching item.
9. Ownership evidence is reviewed.
10. Handover is arranged.
11. Recovery is confirmed.
12. The item is marked as recovered.

### 6.2 Found Item Workflow

1. Student logs into CampusCare.
2. Student selects Report Found Item.
3. Student provides item details.
4. Student uploads an image if appropriate.
5. Student provides private identifying information.
6. Student selects the custody method.
7. The system creates a found-item report.
8. The system checks potential lost-item matches.
9. A possible owner can submit a claim.
10. The finder or recovery officer reviews the claim.
11. A handover is arranged.
12. The transaction is completed and recorded.

## 7. Physical Recovery and Middleman Model

CampusCare will use a hybrid recovery model.

### 7.1 Direct Handover

Applicable to ordinary, low-risk belongings such as:
- Books.
- Notebooks.
- Water bottles.
- Stationery.
- Other low-value belongings.

Process:
- Owner submits a claim.
- Finder reviews the claim.
- Both agree to meet at a safe, public location within the college.
- Both confirm the handover through CampusCare.

Personal home addresses and private meeting locations must not be shared through the platform.

### 7.2 College Office Handover

Applicable to:
- Smartphones.
- Laptops.
- Wallets.
- Watches.
- ID cards.
- Bank cards.
- Sensitive documents.
- Disputed belongings.

Process:
1. Finder submits the item to an authorized college office.
2. Recovery officer records the item.
3. System records the custody status.
4. Owner submits a claim.
5. Officer checks ownership evidence.
6. Owner visits the authorized office.
7. Officer verifies the owner.
8. Officer releases the item.
9. Both parties confirm completion.

### 7.3 Responsibility

| Responsibility | Assigned party |
|---|---|
| Accurate reporting | Student |
| Initial matching | CampusCare system |
| Ownership evidence | Claimant |
| Ordinary item handover | Finder and owner |
| High-risk item verification | Recovery officer |
| Physical storage | College-authorized staff |
| Dispute handling | College administrator |
| Technical operation | Project/platform operator |

The project developer is responsible for maintaining the application, not personally collecting or storing every found item.

The college must approve and appoint the recovery officer before operating the physical custody process.

## 8. Trust and Verification Policy

### 8.1 User Verification

Users must be associated with the institution.

Proposed registration process:
- Institutional email address.
- Email verification.
- Student or staff identification.
- Admin approval if automatic institutional verification is unavailable.

Email verification confirms access to an email account; it does not independently prove current student status. For this reason, college-domain restrictions and/or an approved student list should be used.

### 8.2 Ownership Verification

Ownership verification will use item-specific information.

Examples:

| Item | Evidence |
|---|---|
| Phone | Unlocking the device in person or identifying device details |
| Laptop | Device login, serial number or unique markings |
| Wallet | Specific contents and distinctive features |
| Keys | Keychain and matching lock demonstration where safe |
| Books | Name, notes, stickers or unique markings |
| Earphones | Device pairing or distinguishing details |
| Watch | Distinctive features or serial information |
| ID card | Institutional identity verification |

### 8.3 Verification Levels

**Level 1 – Finder Verification**

Used for ordinary items.

The finder compares the claimant's private description with the actual item.

**Level 2 – Administrator Verification**

Used for valuable, sensitive or disputed items.

An authorized college representative reviews evidence and approves the handover.

**Important:** A matching algorithm or public description is never sufficient proof of ownership.

### 8.4 Private Evidence

When reporting a found item, the finder can enter:
- Distinctive marks.
- Specific contents.
- Serial information, where appropriate.
- Unique scratches.
- Other identifying details.

These details must not be included in public item listings.

The claimant must independently provide matching information.

## 9. Reward and Collateral Policy

### 9.1 Reward

An optional reward can be offered by the owner.

Example:
- Owner offers ₹200 for the safe return of a lost belonging.
- Finder completes the handover.
- Owner voluntarily pays the reward directly to the finder.

Rules:
- Rewards are optional.
- No reward is necessary to submit a claim.
- Finders cannot demand payment for returning an item.
- Rewards are not proof of ownership.
- CampusCare does not hold the money.
- The reward status is recorded for reference.

### 9.2 Collateral

No mandatory deposit will be collected from the owner or finder.

Reasons:
- It discourages honest reporting.
- Payment does not establish trustworthiness.
- It creates refund and financial management responsibilities.
- It unnecessarily complicates the project.

**Final policy: No compulsory collateral, no compulsory recovery charges and no payment gateway in Version 1.**

## 10. Privacy Policy

The application must protect:

- Student names and institutional IDs.
- Email addresses.
- Phone numbers.
- Private item descriptions.
- Ownership evidence.
- Uploaded documents.
- Private messages.

Privacy requirements:
- Public listings must not show personal contact information.
- Private evidence must only be accessible to authorized parties.
- Sensitive items must have restricted descriptions and images.
- Only necessary personal information should be collected.
- Images containing ID cards or personal information must not be publicly exposed.
- Users must be informed about data collection and use.
- Admin access must be restricted.
- Data retention and deletion must follow college policy and applicable law.

The college and platform operator should document their respective privacy responsibilities before production deployment.

## 11. Business Rules

| ID | Business rule |
|---|---|
| BR-01 | Only verified institutional users can use protected platform features. |
| BR-02 | Each report must have a unique reference ID. |
| BR-03 | Users can report both lost and found items. |
| BR-04 | Public listings must not contain private evidence. |
| BR-05 | Users must submit ownership evidence before claiming an item. |
| BR-06 | High-risk items require authorized human verification. |
| BR-07 | No mandatory collateral is allowed. |
| BR-08 | Rewards are optional. |
| BR-09 | No one can demand payment to return property. |
| BR-10 | All completed handovers must be recorded. |
| BR-11 | Resolved items must not appear as active listings. |
| BR-12 | Admin actions must be logged. |
| BR-13 | Duplicate claims must be escalated. |
| BR-14 | A match does not automatically establish ownership. |
| BR-15 | Physical custody is the responsibility of the authorized custodian. |
| BR-16 | Suspicious or potentially stolen property must be escalated. |

## 12. Business Success Criteria

The project will be evaluated using:

- Number of registered users.
- Number of lost-item reports.
- Number of found-item reports.
- Number of potential matches.
- Number of claims.
- Number of successfully recovered items.
- Average recovery time.
- Number of unresolved disputes.
- User feedback.

The primary success indicator is the percentage of valid lost reports that result in confirmed recovery.

---

# PART 2 – SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## 13. Product Overview

CampusCare is a responsive web application that allows verified college users to report and recover lost belongings.

The application will have two main interfaces:

1. Student interface.
2. Admin/recovery officer interface.

The application will use Firebase for authentication, data storage, image storage and hosting.

## 14. User Roles

| Function | Student | Admin | Recovery Officer |
|---|---|---|---|
| Register/login | Yes | Yes | Yes |
| Report lost item | Yes | Yes | Yes |
| Report found item | Yes | Yes | Yes |
| View public listings | Yes | Yes | Yes |
| Submit ownership claim | Yes | Yes | As needed |
| Review ordinary claims | As finder | Yes | Yes |
| Review sensitive claims | No | Yes | Yes |
| Manage users | No | Yes | No |
| Manage listings | Own reports | Yes | Assigned items |
| Record custody | No | Yes | Yes |
| Confirm handover | Yes | Yes | Yes |
| View analytics | No | Yes | Limited |
| Handle disputes | No | Yes | Assist |

## 15. Functional Requirements

### FR-01: User Registration

The system shall allow users to register using their college email.

Fields:
- Full name.
- College email.
- Password.
- Student ID or staff ID.
- Department.
- Course.
- Academic year.

The system shall verify the email before granting protected access.

### FR-02: User Login

The system shall provide:
- Login.
- Logout.
- Email verification.
- Password reset.
- Session management.
- Account status checking.

### FR-03: Student Dashboard

The dashboard shall display:
- Total lost reports submitted.
- Total found reports submitted.
- Active claims.
- Potential matches.
- Recent notifications.
- Quick reporting options.

### FR-04: Report Lost Item

The system shall provide a form with:

- Item name.
- Category.
- Brand.
- Colour.
- Description.
- Date lost.
- Approximate time.
- Location.
- Photograph (optional).
- Distinctive features.

After submission, the system shall create a unique report.

### FR-05: Report Found Item

The system shall provide a form with:

- Item name.
- Category.
- Brand.
- Colour.
- Description.
- Date found.
- Approximate time.
- Location.
- Photograph (optional).
- Private identifying details.
- Current custody arrangement.

### FR-06: Item Listing

The system shall display:
- Item image where safe.
- Item title.
- Category.
- General description.
- Approximate location.
- Date.
- Status.
- Claim option.

Private evidence and contact information must not be displayed.

### FR-07: Search and Filter

Users shall be able to search using:
- Item name.
- Category.
- Colour.
- Brand.
- Location.
- Date.
- Lost/found type.

### FR-08: Potential Matching

The system shall compare lost and found reports using:

- Category.
- Item name.
- Brand.
- Colour.
- Date.
- Location.
- Description keywords.

The system shall display possible matches.

Matching will be rule-based in Version 1. It will not require a machine learning model.

### FR-09: Claim Submission

A student shall be able to claim a found item.

Required information:
- Found item ID.
- Related lost report, if available.
- Distinctive item description.
- Ownership proof.
- Additional supporting information.

The system shall record the claim as pending.

### FR-10: Claim Review

The finder or authorized officer shall be able to:
- View the claim.
- Review the evidence.
- Request additional proof.
- Approve for handover.
- Reject the claim.
- Escalate to admin.

### FR-11: Notifications

The system shall generate notifications for:
- Successful registration.
- New potential match.
- New claim.
- Claim status change.
- Additional proof request.
- Handover scheduling.
- Handover completion.
- Dispute status.

### FR-12: Handover Management

The system shall support:

**Direct handover**
- Finder and owner agree on a safe campus location.
- Both confirm the handover.

**College office handover**
- Officer receives the item.
- Officer records custody.
- Officer verifies the claimant.
- Officer records release.
- Recovery is marked completed.

### FR-13: Reward Declaration

The owner may optionally enter a reward amount.

The system shall record:
- Offered reward.
- Agreed reward.
- Payment confirmation status.

No financial transaction shall be processed by the system.

### FR-14: Admin Dashboard

The administrator shall be able to view:
- Total users.
- Total lost reports.
- Total found reports.
- Pending claims.
- Approved claims.
- Completed recoveries.
- Active disputes.
- Items in college custody.

### FR-15: User Management

The administrator shall be able to:
- View registered users.
- Verify users.
- Suspend users.
- Reactivate users.
- View account status.

### FR-16: Item Management

The administrator shall be able to:
- View all reports.
- Edit or close inappropriate listings.
- Mark items as recovered.
- Review suspicious reports.
- Archive resolved listings.

### FR-17: Custody Management

The recovery officer shall be able to:
- Receive an item.
- Record item condition.
- Record storage reference.
- Record receiving date and time.
- Release the item.
- Record recipient confirmation.

### FR-18: Dispute Management

The administrator shall be able to:
- View reported disputes.
- Review claims and evidence.
- Request additional information.
- Pause a handover.
- Record the resolution.

### FR-19: Feedback

After recovery, the owner and finder can provide basic feedback.

The system shall not expose unverified accusations publicly.

### FR-20: Audit Records

The system shall record important administrative and transaction activities.

---

## 16. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | The interface must be responsive. |
| NFR-02 | The system must work on modern desktop and mobile browsers. |
| NFR-03 | Authentication must be secure. |
| NFR-04 | Database access must be protected by Firebase Security Rules. |
| NFR-05 | Private information must not be accessible to unauthorized users. |
| NFR-06 | Item images must have upload size and type restrictions. |
| NFR-07 | The application must provide understandable error messages. |
| NFR-08 | Important database operations must preserve data consistency. |
| NFR-09 | Admin operations must be traceable. |
| NFR-10 | The system must support database backup/export procedures. |
| NFR-11 | The application must have maintainable code structure. |
| NFR-12 | The application must use HTTPS in production. |

---

# PART 3 – FIREBASE TECHNICAL DESIGN

## 17. Firebase Services

### 17.1 Firebase Authentication

Used for:
- User registration.
- Login.
- Email verification.
- Password reset.
- User session management.

### 17.2 Cloud Firestore

Used for:
- User profiles.
- Lost reports.
- Found reports.
- Claims.
- Notifications.
- Handover records.
- Custody records.
- Dispute records.

### 17.3 Firebase Storage

Used for:
- Item photographs.
- Private ownership evidence.
- Supporting documents.

### 17.4 Firebase Hosting

Used to deploy the web application.

### 17.5 Cloud Functions – Optional

May be used later for:
- Trusted administrative actions.
- Server-side notifications.
- Controlled status transitions.
- Automated matching jobs.

For the first MVP, avoid making Cloud Functions a dependency unless a requirement cannot be safely implemented otherwise. Some Firebase services and deployment configurations require a billing-enabled plan.

## 18. Firestore Database Structure

Recommended collections:

### Collection: users

```text
users/
  userId/
    fullName
    email
    studentId
    department
    course
    academicYear
    role
    verificationStatus
    accountStatus
    createdAt
```

### Collection: items

```text
items/
  itemId/
    title
    itemType
    category
    brand
    colour
    publicDescription
    location
    date
    imagePath
    reportedBy
    custodyType
    status
    createdAt
```

### Collection: privateItemDetails

```text
privateItemDetails/
  itemId/
    privateDescription
    distinctiveFeatures
    serialInformation
    submittedBy
```

This separation is important because Firestore security rules do not hide selected fields inside a document. Private data must be stored separately.

### Collection: claims

```text
claims/
  claimId/
    itemId
    claimantId
    evidenceDescription
    evidencePath
    status
    reviewedBy
    reviewReason
    createdAt
```

### Collection: handovers

```text
handovers/
  handoverId/
    itemId
    claimId
    ownerId
    finderId
    handoverType
    location
    scheduledAt
    ownerConfirmed
    finderConfirmed
    officerId
    status
    completedAt
```

### Collection: custodyRecords

```text
custodyRecords/
  custodyId/
    itemId
    receivedBy
    releasedBy
    condition
    storageReference
    receivedAt
    releasedAt
```

### Collection: notifications

```text
notifications/
  notificationId/
    userId
    title
    message
    type
    isRead
    createdAt
```

### Collection: disputes

```text
disputes/
  disputeId/
    itemId
    claimId
    raisedBy
    reason
    description
    status
    assignedAdmin
    resolution
    createdAt
```

### Collection: auditLogs

```text
auditLogs/
  logId/
    actorId
    action
    recordId
    recordType
    timestamp
```

Audit logs should be created through trusted server-side operations for sensitive events, rather than trusting client-generated records.

## 19. Security Requirements

Firebase security must be configured before real users are onboarded.

Requirements:

1. Require authentication for protected records.
2. Verify email and institutional eligibility.
3. Restrict access by role.
4. Prevent users from changing their own role.
5. Protect private item details.
6. Protect ownership evidence.
7. Restrict Storage access.
8. Validate allowed file types and sizes.
9. Prevent unauthorized deletion of reports.
10. Record administrative actions.
11. Prevent users from modifying another user's claims.
12. Restrict data access to the correct college.

Admin roles must be assigned through a trusted administrative process, not through a user-editable registration form.

Firestore and Storage Security Rules must be tested using the Firebase Emulator Suite before deployment.

## 20. Proposed Application Folder Structure

```text
campuscare/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
│
├── lost-items.html
├── found-items.html
├── report-lost.html
├── report-found.html
├── item-details.html
│
├── my-reports.html
├── my-claims.html
├── notifications.html
├── profile.html
│
├── admin/
│   ├── dashboard.html
│   ├── users.html
│   ├── items.html
│   ├── claims.html
│   ├── custody.html
│   └── disputes.html
│
├── css/
│   ├── style.css
│   ├── dashboard.css
│   └── responsive.css
│
├── js/
│   ├── firebase-config.js
│   ├── auth.js
│   ├── database.js
│   ├── storage.js
│   ├── lost-items.js
│   ├── found-items.js
│   ├── matching.js
│   ├── claims.js
│   ├── handovers.js
│   ├── notifications.js
│   └── admin.js
│
└── assets/
    ├── images/
    └── icons/
```

---

# PART 4 – PROJECT DEVELOPMENT PLAN

## 21. Development Phases

### Phase 1: Project Setup

- Create Firebase project.
- Enable Authentication.
- Create Firestore database.
- Configure Storage.
- Configure Firebase Hosting.
- Create frontend folder structure.
- Establish basic UI theme.

### Phase 2: Authentication

- Registration.
- Login.
- Email verification.
- User profile.
- Role-based navigation.
- Admin account setup.

### Phase 3: Lost and Found Module

- Lost report form.
- Found report form.
- Image upload.
- Firestore integration.
- Item listing.
- Search and filtering.

### Phase 4: Matching Module

- Category matching.
- Keyword matching.
- Brand and colour matching.
- Date and location comparison.
- Display potential matches.

### Phase 5: Claim and Verification

- Claim submission.
- Private evidence.
- Claim review.
- Approval and rejection.
- Additional evidence requests.

### Phase 6: Handover and Administration

- Direct handover.
- College office handover.
- Custody records.
- Handover confirmation.
- Admin dashboard.
- Dispute management.

### Phase 7: Testing and Deployment

- Authentication tests.
- Security rules tests.
- Database tests.
- Image storage tests.
- Functional tests.
- Responsive UI testing.
- Firebase deployment.
- College pilot demonstration.

## 22. MVP Priority

| Feature | Priority |
|---|---|
| Registration and login | Must have |
| Student dashboard | Must have |
| Lost-item report | Must have |
| Found-item report | Must have |
| Search and filtering | Must have |
| Image upload | Must have |
| Claim submission | Must have |
| Private evidence | Must have |
| Admin verification | Must have |
| Handover records | Must have |
| Basic matching | Must have |
| Notifications | Should have |
| Custody management | Should have |
| Dispute management | Should have |
| Reward declaration | Could have |
| Advanced AI matching | Future |

## 23. Testing Requirements

| Test ID | Test scenario | Expected outcome |
|---|---|---|
| TC-01 | Register with valid college email | Account created |
| TC-02 | Login with incorrect password | Access denied |
| TC-03 | Unverified user opens protected page | Access denied |
| TC-04 | Student submits lost report | Record created |
| TC-05 | Student submits found report | Record created |
| TC-06 | Student searches for an item | Matching listings displayed |
| TC-07 | Similar lost and found records exist | Potential match suggested |
| TC-08 | Student claims a found item | Claim created |
| TC-09 | Unauthorized user requests private evidence | Access denied |
| TC-10 | Admin reviews a claim | Status updated |
| TC-11 | Finder and owner confirm direct handover | Recovery completed |
| TC-12 | Officer receives an item | Custody record created |
| TC-13 | Officer releases an item | Release recorded |
| TC-14 | Unauthorized user attempts admin access | Access denied |
| TC-15 | User attempts to change their role | Operation rejected |
| TC-16 | Two users claim the same item | Admin review required |
| TC-17 | User reports suspicious behaviour | Dispute/report created |
| TC-18 | User tries to claim without offering reward | Claim permitted |

## 24. Project Deliverables

The final academic project should contain:

1. Project proposal.
2. BRD document.
3. SRS document.
4. Use-case diagram.
5. Activity diagrams.
6. Data Flow Diagram (DFD).
7. Entity Relationship Diagram (ERD).
8. Firebase database structure.
9. Application source code.
10. Firebase security rules.
11. Test cases and results.
12. Screenshots.
13. Final project report.
14. Presentation and demonstration.

## 25. Final Project Definition

CampusCare is a web-based college Lost and Found Management System that enables verified students and authorized college staff to report lost and found belongings, identify potential matches, verify ownership and complete safe, documented handovers.

The system uses Firebase for authentication, database management, image storage and hosting.

It follows a hybrid recovery model in which ordinary belongings can be returned directly between verified students, while valuable, sensitive or disputed belongings are handled through authorized college personnel.

The system does not require collateral, mandatory rewards or recovery fees.

Its primary objective is to provide a simple, trustworthy, privacy-conscious and accountable lost-and-found process within a college campus.

**END OF DOCUMENT – CAMPUSCARE BRD + SRS VERSION 1.1**