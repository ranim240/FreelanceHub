"""Script de seeding — injecte les produits de démo dans MongoDB."""
from app import create_app

app = create_app()

# Importer db APRÈS create_app() car init_db() s'exécute dans create_app()
from app.extensions import db


PRODUCTS = [
    {
        "badge": "STARTER KIT",
        "category": "Dev",
        "title": "Full E-commerce Starter Kit",
        "author": "Ali souissi",
        "authorInitials": "AS",
        "rating": 4.9,
        "reviews": 247,
        "price": 400,
        "image": "assets/images/products/e-commerceKit.png",
        "version": "3.2.0",
        "lastUpdate": "15 Jan 2026",
        "license": "Commercial",
        "description": "Complete starter kit to create a modern and high-performing e-commerce store. Built with React, TypeScript and the latest web technologies, this starter kit lets you launch your project in hours instead of weeks.\n\nAll essential components are included: secure authentication, shopping cart management, a complete checkout process, an admin dashboard, product management, and much more.",
        "techStack": ["React 19", "TypeScript", "Stripe API", "Next.js 14", "FramerMotion", "TailwindCSS"],
        "features": [
            "Full Authentication, Login, registration, password recovery, OAuth",
            "Shopping Cart Management — Persistent cart, automatic total calculation",
            "Integrated Payment Stripe, PayPal, credit card",
            "Admin Dashboard — Product management, orders, real-time statistics",
            "Responsive Design — Mobile-first, adapts to all screen sizes",
            "Optimised SEO — Meta tags, sitemap, schema markup"
        ],
        "customerReviews": [
            {"author": "Client Client", "initials": "CC", "rating": 5, "comment": "Excellent kit! I was able to launch my online store in less than a week. The code is very well structured and the documentation is clear. I highly recommend it!", "date": "12 Jan 2026"},
            {"author": "Mohammed Salhi", "initials": "MS", "rating": 5, "comment": "Perfect for rapid prototyping. Saved me weeks of work. The Stripe integration alone is worth the price.", "date": "08 Jan 2026"},
            {"author": "Lina Boukhari", "initials": "LB", "rating": 4, "comment": "Very complete kit, great documentation. Would love to see more theme options in the next version.", "date": "02 Jan 2026"}
        ],
        "purchased": False,
        "featured": True
    },
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

# Exécution du seeding
with app.app_context():
    db.products.delete_many({})  # Vide la collection d'abord
    result = db.products.insert_many(PRODUCTS)
    print(f"✅ {len(result.inserted_ids)} produits insérés dans MongoDB !")