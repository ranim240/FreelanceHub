import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-freelancers',
  templateUrl: './freelancers.page.html',
  styleUrls: ['./freelancers.page.scss'],
  standalone: false,
})
export class FreelancersPage implements OnInit {

  searchText   = '';
  activeDomain = 'all';

  domains = [
    { label: 'All',        value: 'all',       icon: 'grid-outline'          },
    { label: 'Design',     value: 'design',    icon: 'color-palette-outline' },
    { label: 'Dev',        value: 'dev',       icon: 'code-slash-outline'    },
    { label: 'Writing',    value: 'writing',   icon: 'pencil-outline'        },
    { label: 'Marketing',  value: 'marketing', icon: 'megaphone-outline'     },
    { label: 'Video',      value: 'video',     icon: 'videocam-outline'      },
    { label: 'Data',       value: 'data',      icon: 'stats-chart-outline'   },
  ];

  freelancers = [
    {
      id: 1,
      initials:    'AB',
      name:        'Anis Ben Ali',
      domain:      'UI/UX Design',
      domainKey:   'design',
      location:    'Tunis, Tunisia',
      rating:      '4.9',
      reviews:     34,
      bio:         'Senior UI/UX designer with 6+ years of experience creating beautiful digital products for startups and enterprises.',
      skills:      ['Figma', 'Adobe XD', 'Prototyping', 'Branding', 'Illustration'],
      tjm:         350,
      completed:   28,
      avatarColor: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)',
    },
    {
      id: 2,
      initials:    'SR',
      name:        'Sarra Rhouma',
      domain:      'Web Development',
      domainKey:   'dev',
      location:    'Sfax, Tunisia',
      rating:      '4.8',
      reviews:     21,
      bio:         'Full-stack developer specializing in React, Node.js and mobile apps. Delivered 20+ projects on time.',
      skills:      ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Ionic'],
      tjm:         400,
      completed:   20,
      avatarColor: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
    },
    {
      id: 3,
      initials:    'MK',
      name:        'Mohamed Khelifi',
      domain:      'Content Writing',
      domainKey:   'writing',
      location:    'Sousse, Tunisia',
      rating:      '4.7',
      reviews:     45,
      bio:         'SEO content writer and copywriter. Expert in tech, finance and marketing topics. Fluent in Arabic, French and English.',
      skills:      ['SEO', 'Copywriting', 'Blogging', 'Arabic', 'French'],
      tjm:         180,
      completed:   62,
      avatarColor: 'linear-gradient(135deg, #92400e 0%, #f97316 100%)',
    },
    {
      id: 4,
      initials:    'LB',
      name:        'Lina Baccar',
      domain:      'Digital Marketing',
      domainKey:   'marketing',
      location:    'Tunis, Tunisia',
      rating:      '4.6',
      reviews:     18,
      bio:         'Social media strategist and growth hacker. Helped 15+ brands grow their online presence by 200%.',
      skills:      ['Social Media', 'Google Ads', 'Analytics', 'Email Marketing'],
      tjm:         250,
      completed:   17,
      avatarColor: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)',
    },
    {
      id: 5,
      initials:    'YT',
      name:        'Yassine Trabelsi',
      domain:      'Data / BI',
      domainKey:   'data',
      location:    'Monastir, Tunisia',
      rating:      '4.8',
      reviews:     12,
      bio:         'Data analyst and BI consultant. Expert in Python, Power BI and machine learning projects.',
      skills:      ['Python', 'Power BI', 'SQL', 'Machine Learning', 'Tableau'],
      tjm:         450,
      completed:   11,
      avatarColor: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // TODO: charger depuis Flask
    // this.http.get('/api/freelancers').subscribe(...)
  }

  setDomain(value: string) {
    this.activeDomain = value;
  }

  get filteredFreelancers() {
    return this.freelancers.filter(fl => {
      const matchDomain = this.activeDomain === 'all'
        || fl.domainKey === this.activeDomain;
      const matchSearch = !this.searchText
        || fl.name.toLowerCase().includes(this.searchText.toLowerCase())
        || fl.domain.toLowerCase().includes(this.searchText.toLowerCase())
        || fl.skills.some(s => s.toLowerCase().includes(this.searchText.toLowerCase()));
      return matchDomain && matchSearch;
    });
  }

  viewProfile(fl: any) {
    this.router.navigate(['/client/freelancers', fl.id]);
  }

  contactFreelancer(fl: any) {
    this.router.navigate(['/client/messages'], {
      queryParams: { freelancerId: fl.id, name: fl.name }
    });
  }

  navigate(page: string) {
    this.router.navigate(['/' + page]);
  }
}