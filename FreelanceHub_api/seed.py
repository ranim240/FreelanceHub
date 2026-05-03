"""Script de seeding — injecte les produits de démo dans MongoDB."""
from datetime import datetime
from app import create_app

app = create_app()

# Importer db APRÈS create_app() car init_db() s'exécute dans create_app()
from app.extensions import db


PRODUCTS = [
   
    {
        "badge": "AI MODEL",
        "category": "AI",
        "title": "Sentiment Analysis API",
        "author": "AI Labs",
        "authorInitials": "AL",
        "rating": 4.7,
        "reviews": 89,
        "price": 250,
        "image": "assets/images/products/sentiment_analysis_dashboard.png",
        "version": "1.4.2",
        "lastUpdate": "20 Feb 2026",
        "license": "Commercial",
        "description": "Pre-trained sentiment analysis model with a ready-to-use REST API. Supports English, French and Arabic. Achieves 94% accuracy on benchmark datasets.\n\nDeploy in minutes on AWS, GCP or any Docker-compatible environment.",
        "techStack": ["Python", "FastAPI", "TensorFlow", "Docker", "Redis"],
        "features": [
            "Multi-language support: English, French, Arabic",
            "94% accuracy on standard benchmarks",
            "REST API with OpenAPI documentation",
            "Docker & Kubernetes ready",
            "Real-time inference < 50ms",
            "Batch processing endpoint included"
        ],
        "customerReviews": [
            {"author": "Data Dev", "initials": "DD", "rating": 5, "comment": "Incredibly accurate and fast. Integration was smooth. Best AI kit I have purchased.", "date": "18 Feb 2026"}
        ],
        "purchased": False,
        "featured": False
    },
    {
        "badge": "DESIGN",
        "category": "Design",
        "title": "Mobile UI Kit — Finance",
        "author": "DesignPro",
        "authorInitials": "DP",
        "rating": 4.8,
        "reviews": 134,
        "price": 180,
        "image": "assets/images/products/Mobile_UI_Kit.png",
        "version": "2.0.1",
        "lastUpdate": "10 Jan 2026",
        "license": "Commercial",
        "description": "120+ high-quality screens for a modern fintech mobile app. Built with Figma Auto Layout and design tokens, making it easy to customise colours, fonts and components.\n\nIncludes dark and light mode, interactive prototypes and a full component library.",
        "techStack": ["Figma", "Auto Layout", "Design Tokens", "Prototype"],
        "features": [
            "120+ fully designed screens",
            "Dark & Light mode included",
            "Figma Auto Layout — Fully responsive components",
            "Design tokens for easy theme customisation",
            "Interactive prototype ready to share",
            "Free font & icon library included"
        ],
        "customerReviews": [
            {"author": "Creative Studio", "initials": "CS", "rating": 5, "comment": "Outstanding quality. Saved our design team weeks of work. The component library is incredibly well organised.", "date": "09 Jan 2026"}
        ],
        "purchased": False,
        "featured": True
    },
    {
        "badge": "STARTER KIT",
        "category": "Dev",
        "title": "Ionic Angular Boilerplate",
        "author": "MobileDev",
        "authorInitials": "MD",
        "rating": 4.6,
        "reviews": 63,
        "price": 150,
        "image": "assets/images/products/Ionic_Angular_Boilerplate.png",
        "version": "6.1.0",
        "lastUpdate": "05 Feb 2026",
        "license": "Commercial",
        "description": "Production-ready Ionic Angular boilerplate with everything pre-configured. Skip the setup and start building features from day one.\n\nIncludes JWT authentication, HTTP interceptors, lazy-loaded modules, Capacitor native plugins and a full state management setup.",
        "techStack": ["Ionic 6", "Angular 17", "Capacitor", "RxJS", "NgRx"],
        "features": [
            "JWT Authentication with refresh tokens",
            "HTTP Interceptors for error handling",
            "Lazy-loaded modules — Optimised performance",
            "Capacitor Camera, Geolocation, Filesystem plugins",
            "NgRx state management boilerplate",
            "Dark mode support built-in"
        ],
        "customerReviews": [
            {"author": "Junior Dev", "initials": "JD", "rating": 5, "comment": "As a student this saved me so much time. The code is clean and well commented. Perfect for learning.", "date": "03 Feb 2026"}
        ],
        "purchased": False,
        "featured": False
    },
    {
        "badge": "AI MODEL",
        "category": "AI",
        "title": "Resume Parser — NLP Model",
        "author": "NLP Works",
        "authorInitials": "NW",
        "rating": 4.5,
        "reviews": 41,
        "price": 300,
        "image": "assets/images/products/Resume_Parser_NLP_CVResume.png",
        "version": "2.1.0",
        "lastUpdate": "01 Feb 2026",
        "license": "Commercial",
        "description": "Automatically extract skills, work experience, education and contact details from resumes in PDF and DOCX formats.\n\nBuilt with spaCy and fine-tuned on 50,000+ resumes for high accuracy across multiple industries.",
        "techStack": ["Python", "spaCy", "Flask", "PyMuPDF", "Docker"],
        "features": [
            "PDF & DOCX resume parsing",
            "Skills extraction with taxonomy matching",
            "Work experience timeline detection",
            "Education & certification extraction",
            "JSON output — Easy to integrate",
            "Supports English and French resumes"
        ],
        "customerReviews": [
            {"author": "HR Tech", "initials": "HT", "rating": 4, "comment": "Works great for our recruitment platform. Accuracy is impressive. Would love Arabic support in the future.", "date": "28 Jan 2026"}
        ],
        "purchased": False,
        "featured": False
    },
    {
        "badge": "ARCHITECTURE",
        "category": "Dev",
        "title": "Microservices Architecture Plan",
        "author": "CloudArch",
        "authorInitials": "CA",
        "rating": 4.9,
        "reviews": 58,
        "price": 350,
        "image": "assets/images/products/Microservices.png",
        "version": "1.0.0",
        "lastUpdate": "25 Jan 2026",
        "license": "Commercial",
        "description": "Complete microservices architecture blueprint for production-grade applications. Includes Docker Compose configurations, API gateway setup, service discovery and full CI/CD pipelines.\n\nDesigned for teams that need to scale fast without starting from scratch.",
        "techStack": ["Docker", "Kubernetes", "Redis", "Nginx", "GitHub Actions"],
        "features": [
            "Docker Compose — Full local development setup",
            "Kubernetes manifests for production deployment",
            "API Gateway with Nginx and rate limiting",
            "Service discovery and load balancing",
            "CI/CD pipelines with GitHub Actions",
            "Monitoring stack: Prometheus + Grafana"
        ],
        "customerReviews": [
            {"author": "Backend Team", "initials": "BT", "rating": 5, "comment": "This blueprint saved our team months of architecture work. Extremely well documented.", "date": "22 Jan 2026"}
        ],
        "purchased": False,
        "featured": True
    },
    {
        "badge": "DESIGN",
        "category": "Design",
        "title": "Brand Identity Mega Pack",
        "author": "CreativeHub",
        "authorInitials": "CH",
        "rating": 4.4,
        "reviews": 92,
        "price": 120,
        "image": "assets/images/products/Brand_Identity_Mega_Pack.png",
        "version": "1.5.0",
        "lastUpdate": "18 Jan 2026",
        "license": "Commercial",
        "description": "Everything you need for a complete professional brand identity. From logo design to social media templates, this pack covers every touchpoint of your brand.\n\nPerfect for startups and small businesses launching their visual identity.",
        "techStack": ["Illustrator", "Figma", "Photoshop"],
        "features": [
            "Logo suite — Primary, secondary and icon variations",
            "Full colour palette and typography guide",
            "Business card and letterhead templates",
            "30+ social media post templates",
            "Brand guidelines document (PDF)",
            "Web and print ready files"
        ],
        "customerReviews": [
            {"author": "Startup Founder", "initials": "SF", "rating": 4, "comment": "Great value for money. Used it to launch our startup brand in 2 days. Very professional result.", "date": "15 Jan 2026"}
        ],
        "purchased": False,
        "featured": False
    },
    {
        "badge": "CONTENT",
        "category": "Writing",
        "title": "SEO Content Template Pack",
        "author": "ContentPro",
        "authorInitials": "CP",
        "rating": 4.3,
        "reviews": 175,
        "price": 80,
        "image": "assets/images/products/SEO_Content_Template_Pack.png",
        "version": "4.0.0",
        "lastUpdate": "12 Jan 2026",
        "license": "Commercial",
        "description": "50 ready-to-use SEO article templates covering technology, business and lifestyle topics. Each template includes keyword placement guidelines, meta description formulas and internal linking strategies.\n\nUsed by 175+ content creators to rank on Google.",
        "techStack": ["Notion", "Google Docs", "Ahrefs Framework"],
        "features": [
            "50 article templates across 3 niches",
            "Keyword research methodology guide",
            "Meta title and description formulas",
            "Internal linking strategy templates",
            "Content calendar spreadsheet included",
            "SEO checklist for every article"
        ],
        "customerReviews": [
            {"author": "Blogger Pro", "initials": "BP", "rating": 4, "comment": "My traffic increased 60% after using these templates. Clear, actionable and easy to follow.", "date": "10 Jan 2026"}
        ],
        "purchased": False,
        "featured": False
    }
]

ANNOUNCEMENTS = [
    {
      "clientName": "Ahmed Ben Ali", "clientInitials": "AB",
      "postedAt": "2 hours ago", "status": "Open",
      "title": "E-commerce Mobile App Development",
      "description": "Looking for an Ionic/Angular developer to build a full mobile app with cart, payment and push notifications.",
      "tags": ["Ionic", "Angular", "Firebase"], "budget": "800 – 1200 DT", "deadline": "30 days"
    },
    {
      "clientName": "Sara Mansour", "clientInitials": "SM",
      "postedAt": "5 hours ago", "status": "Open",
      "title": "Logo Design & Brand Identity",
      "description": "Need a designer to create a professional logo and complete brand guidelines for a FinTech startup.",
      "tags": ["Logo", "Figma", "Branding"], "budget": "300 – 500 DT", "deadline": "10 days"
    },
    {
      "clientName": "Karim Trabelsi", "clientInitials": "KT",
      "postedAt": "1 day ago", "status": "Urgent",
      "title": "SEO Articles for Tech Blog",
      "description": "Looking for an experienced writer to produce 10 SEO-optimized articles on AI, cybersecurity and cloud topics.",
      "tags": ["SEO", "Writing", "AI"], "budget": "150 – 250 DT", "deadline": "7 days"
    }
]

CATEGORIES = [
    { "name": "All",       "icon": "grid-outline",          "active": True  },
    { "name": "AI",        "icon": "hardware-chip-outline", "active": False },
    { "name": "Design",    "icon": "color-palette-outline", "active": False },
    { "name": "Dev",       "icon": "code-slash-outline",    "active": False },
    { "name": "Writing",   "icon": "pencil-outline",        "active": False },
    { "name": "Marketing", "icon": "megaphone-outline",     "active": False }
]

FAQS = [
    {
      "question": "How do I become a freelancer on FreelanceHub?",
      "answer": "Create an account, choose the 'Freelancer' role, complete your profile and submit it for review. An admin will approve it within 24–48 hours.",
      "open": True
    },
    {
      "question": "How do I post a project as a client?",
      "answer": "After signing up with the 'Client' role, go to Announcements and click 'New Offer'. Fill in the title, description, budget and deadline.",
      "open": False
    },
    {
      "question": "How does the digital products Store work?",
      "answer": "The Store offers starter kits, source code, AI models and designs. After a simulated purchase, you can download the file directly to your device.",
      "open": False
    },
    {
      "question": "Are my payments secure?",
      "answer": "Yes, all transactions go through a secure payment system. Payment is only released once the delivery has been validated.",
      "open": False
    },
    {
      "question": "How do I contact a freelancer?",
      "answer": "From a Gig page or an announcement, click 'Message' to open a direct conversation with the freelancer.",
      "open": False
    }
]

# ── Test users for contracts ──────────────────────────────
# Password is "test"
TEST_HASH = "scrypt:32768:8:1$W4hwDoyRX2029Gbv$9d960a66416649098d54b25f1fd86f8523197c64fe18711f29f0a1b94219e7f3f9383483f8c89afddad5c9a04ec2321ee463c203f5c40ab4837b915df73b4c8b"

TEST_CLIENT = {
    "email": "client@test.com",
    "password": TEST_HASH,
    "firstName": "Ahmed",
    "lastName": "Ben Ali",
    "username": "ahmed_client",
    "role": "client",
    "status": "active",
    "createdAt": datetime.utcnow(),
    "updatedAt": datetime.utcnow()
}

TEST_FREELANCER_1 = {
    "email": "freelancer1@test.com",
    "password": TEST_HASH,
    "firstName": "Sara",
    "lastName": "Mansour",
    "username": "sara_dev",
    "role": "freelancer",
    "domain": "Web Development",
    "status": "active",
    "createdAt": datetime.utcnow(),
    "updatedAt": datetime.utcnow()
}

TEST_FREELANCER_2 = {
    "email": "freelancer2@test.com",
    "password": TEST_HASH,
    "firstName": "Karim",
    "lastName": "Trabelsi",
    "username": "karim_design",
    "role": "freelancer",
    "domain": "UI/UX Design",
    "status": "active",
    "createdAt": datetime.utcnow(),
    "updatedAt": datetime.utcnow()
}


def seed_contracts(client_id, freelancer1_id, freelancer2_id):
    """Create demo contracts between test users."""
    return [
        {
            "clientId": str(client_id),
            "freelancerId": str(freelancer1_id),
            "title": "E-commerce Mobile App Development",
            "description": "Build a complete mobile shopping app with cart, payment and push notifications using Ionic/Angular.",
            "amount": 1200,
            "commissionRate": 10,
            "commission": 120,
            "freelancerAmount": 1080,
            "currency": "DT",
            "status": "in_progress",
            "milestones": [
                {"id": "m1", "title": "UI/UX Design", "description": "Wireframes and mockups for all screens", "deadline": "2026-05-10", "status": "completed"},
                {"id": "m2", "title": "Frontend Development", "description": "Build all app screens and components", "deadline": "2026-05-25", "status": "in_progress"},
                {"id": "m3", "title": "Backend Integration", "description": "Connect API endpoints and test", "deadline": "2026-06-05", "status": "pending"},
                {"id": "m4", "title": "Final Delivery", "description": "Testing, bug fixes and deployment", "deadline": "2026-06-15", "status": "pending"}
            ],
            "tasks": [
                {"id": "t1", "milestoneId": "m1", "title": "Create wireframes", "startDate": "2026-05-01", "endDate": "2026-05-04", "progress": 100, "status": "done"},
                {"id": "t2", "milestoneId": "m1", "title": "Design mockups in Figma", "startDate": "2026-05-04", "endDate": "2026-05-08", "progress": 100, "status": "done"},
                {"id": "t3", "milestoneId": "m1", "title": "Client review & approval", "startDate": "2026-05-08", "endDate": "2026-05-10", "progress": 100, "status": "done"},
                {"id": "t4", "milestoneId": "m2", "title": "Setup Ionic project", "startDate": "2026-05-10", "endDate": "2026-05-12", "progress": 100, "status": "done"},
                {"id": "t5", "milestoneId": "m2", "title": "Build product listing page", "startDate": "2026-05-12", "endDate": "2026-05-16", "progress": 60, "status": "in_progress"},
                {"id": "t6", "milestoneId": "m2", "title": "Build cart & checkout", "startDate": "2026-05-16", "endDate": "2026-05-20", "progress": 0, "status": "todo"},
                {"id": "t7", "milestoneId": "m2", "title": "Build user profile", "startDate": "2026-05-20", "endDate": "2026-05-25", "progress": 0, "status": "todo"},
                {"id": "t8", "milestoneId": "m3", "title": "API integration", "startDate": "2026-05-25", "endDate": "2026-05-30", "progress": 0, "status": "todo"},
                {"id": "t9", "milestoneId": "m3", "title": "Payment gateway setup", "startDate": "2026-05-30", "endDate": "2026-06-05", "progress": 0, "status": "todo"},
                {"id": "t10", "milestoneId": "m4", "title": "Testing & bug fixes", "startDate": "2026-06-05", "endDate": "2026-06-12", "progress": 0, "status": "todo"},
                {"id": "t11", "milestoneId": "m4", "title": "Deployment", "startDate": "2026-06-12", "endDate": "2026-06-15", "progress": 0, "status": "todo"}
            ],
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "paidAt": datetime.utcnow(),
            "deliveredAt": None,
            "validatedAt": None
        },
        {
            "clientId": str(client_id),
            "freelancerId": str(freelancer2_id),
            "title": "Logo Design & Brand Identity",
            "description": "Professional logo and complete brand guidelines for a FinTech startup.",
            "amount": 500,
            "commissionRate": 10,
            "commission": 50,
            "freelancerAmount": 450,
            "currency": "DT",
            "status": "delivered",
            "milestones": [
                {"id": "m1", "title": "Research & Concepts", "description": "Market research and 3 logo concepts", "deadline": "2026-05-05", "status": "completed"},
                {"id": "m2", "title": "Final Logo", "description": "Refined logo with variations", "deadline": "2026-05-10", "status": "completed"},
                {"id": "m3", "title": "Brand Guidelines", "description": "Complete brand identity document", "deadline": "2026-05-15", "status": "completed"}
            ],
            "tasks": [
                {"id": "t1", "milestoneId": "m1", "title": "Market research", "startDate": "2026-05-01", "endDate": "2026-05-03", "progress": 100, "status": "done"},
                {"id": "t2", "milestoneId": "m1", "title": "Sketch 3 concepts", "startDate": "2026-05-03", "endDate": "2026-05-05", "progress": 100, "status": "done"},
                {"id": "t3", "milestoneId": "m2", "title": "Refine chosen concept", "startDate": "2026-05-05", "endDate": "2026-05-08", "progress": 100, "status": "done"},
                {"id": "t4", "milestoneId": "m2", "title": "Create logo variations", "startDate": "2026-05-08", "endDate": "2026-05-10", "progress": 100, "status": "done"},
                {"id": "t5", "milestoneId": "m3", "title": "Brand guidelines PDF", "startDate": "2026-05-10", "endDate": "2026-05-14", "progress": 100, "status": "done"},
                {"id": "t6", "milestoneId": "m3", "title": "Social media templates", "startDate": "2026-05-14", "endDate": "2026-05-15", "progress": 100, "status": "done"}
            ],
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "paidAt": datetime.utcnow(),
            "deliveredAt": datetime.utcnow(),
            "validatedAt": None
        },
        {
            "clientId": str(client_id),
            "freelancerId": str(freelancer1_id),
            "title": "SEO Content Writing",
            "description": "10 SEO-optimized articles on AI and cybersecurity topics.",
            "amount": 300,
            "commissionRate": 10,
            "commission": 30,
            "freelancerAmount": 270,
            "currency": "DT",
            "status": "completed",
            "milestones": [
                {"id": "m1", "title": "Research & Outlines", "description": "Keyword research and article outlines", "deadline": "2026-04-15", "status": "completed"},
                {"id": "m2", "title": "Article Writing", "description": "Write all 10 articles", "deadline": "2026-04-25", "status": "completed"},
                {"id": "m3", "title": "Review & Publish", "description": "Final review and formatting", "deadline": "2026-04-30", "status": "completed"}
            ],
            "tasks": [
                {"id": "t1", "milestoneId": "m1", "title": "Keyword research", "startDate": "2026-04-10", "endDate": "2026-04-12", "progress": 100, "status": "done"},
                {"id": "t2", "milestoneId": "m1", "title": "Create outlines", "startDate": "2026-04-12", "endDate": "2026-04-15", "progress": 100, "status": "done"},
                {"id": "t3", "milestoneId": "m2", "title": "Write 10 articles", "startDate": "2026-04-15", "endDate": "2026-04-25", "progress": 100, "status": "done"},
                {"id": "t4", "milestoneId": "m3", "title": "Review & format", "startDate": "2026-04-25", "endDate": "2026-04-30", "progress": 100, "status": "done"}
            ],
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "paidAt": datetime.utcnow(),
            "deliveredAt": datetime.utcnow(),
            "validatedAt": datetime.utcnow()
        }
    ]


# Exécution du seeding
with app.app_context():
    # Produits
    db.products.delete_many({})  # Vide la collection d'abord
    res_prod = db.products.insert_many(PRODUCTS)
    print(f"✅ {len(res_prod.inserted_ids)} produits insérés dans MongoDB !")

    # Annonces
    db.announcements.delete_many({})
    res_ann = db.announcements.insert_many(ANNOUNCEMENTS)
    print(f"✅ {len(res_ann.inserted_ids)} annonces insérées !")

    # Catégories
    db.categories.delete_many({})
    res_cat = db.categories.insert_many(CATEGORIES)
    print(f"✅ {len(res_cat.inserted_ids)} catégories insérées !")

    # FAQs
    db.faqs.delete_many({})
    res_faq = db.faqs.insert_many(FAQS)
    print(f"✅ {len(res_faq.inserted_ids)} FAQs insérées !")

    # Test users (upsert — update if already exist)
    for user_data in [TEST_CLIENT, TEST_FREELANCER_1, TEST_FREELANCER_2]:
        db.users.update_one(
            {"email": user_data["email"]},
            {"$set": user_data},
            upsert=True
        )
        print(f"✅ Test user seeded/updated: {user_data['email']}")

    # Get user IDs for contracts
    client = db.users.find_one({"email": "client@test.com"})
    freelancer1 = db.users.find_one({"email": "freelancer1@test.com"})
    freelancer2 = db.users.find_one({"email": "freelancer2@test.com"})

    if client and freelancer1 and freelancer2:
        db.contracts.delete_many({})
        contracts = seed_contracts(client["_id"], freelancer1["_id"], freelancer2["_id"])
        res_contracts = db.contracts.insert_many(contracts)
        print(f"✅ {len(res_contracts.inserted_ids)} contrats insérés !")
    else:
        print("⚠️ Could not create contracts — test users missing")