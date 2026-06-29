// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to customize your site. No other files needed.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Sathvik Loke',
  role: "IMSA '28",
  subhead: 'I build cool things.',
  tagline: 'A high schooler who likes building startups, training models, and chasing down hard problems in bio and AI. Mostly, I just like making things that work.',
  location: 'Greater Chicago Area',
  email: 'lokesathvik@gmail.com',
  resumeUrl: '', // optional: link to a hosted PDF, e.g. "/resume.pdf"
}

export const about = [
  `Hey, I'm Sathvik. I'm a student at IMSA who spends most of his time building things, whether that's a startup, a machine learning model, or a research project that started as a random idea at 2am.`,
  `When I'm not coding or in a lab, you'll catch me at a math competition, a robotics tournament, or playing cello for patients at a memory care unit. I care about making things that actually help people, and I'm just getting started.`,
]

export const skills = [
  'Python', 'PyTorch', 'Pandas', 'Matplotlib',
  'Deep Learning', 'Machine Learning', 'Medical Imaging',
  'Research', 'Data Analysis', 'CPR Certified',
]

export const education = [
  {
    school: 'Illinois Mathematics and Science Academy (IMSA)',
    detail: 'Aurora, Illinois',
    period: 'Aug 2025 – Present',
  },
  {
    school: 'Neuqua Valley High School',
    detail: 'Naperville, Illinois',
    period: 'Aug 2024 – 2025',
  },
]

// Startups / things you build (Projects section)
export const projects = [
  {
    title: 'LANDER',
    description: 'Co-founder. Screening ACL tear risk in athletes, using data and modeling to flag injury risk before it happens.',
    tags: ['Computer Vision', 'Sports Medicine', 'ML'],
    link: 'https://land-r.netlify.app',
  },
  {
    title: 'Vivantal',
    description: "Developer. Healthcare has blind spots; Vivantal doesn't. Building tools to close the gaps in care.",
    tags: ['Patient Interface', 'Healthcare', 'Startup'],
    link: 'https://vivantal.com',
  },
]

// Research work (Research section)
export const research = [
  {
    title: 'Cohort-stratified prioritization of CRISPR–Cas9 sgRNAs for HDR-mediated correction of TP53 hotspot codons in ovarian, pancreatic, and colorectal cancer',
    authors: 'S. Loke, N. Movva, M. Hota',
    venue: 'bioRxiv preprint',
    year: '2026',
    description: 'TP53 is mutated in roughly half of all human cancers. We prioritize CRISPR–Cas9 sgRNAs for HDR-mediated correction of recurrent TP53 hotspot codons, stratified across ovarian, pancreatic, and colorectal cancer cohorts.',
    tags: ['CRISPR', 'Genomics', 'Cancer'],
    link: '',
  },
  {
    title: 'DriftScore: An Anchor-Relative Metric for Detecting Quality Drift in Multi-Turn Multimodal Generation',
    authors: 'S. Loke, N. Movva, R. Gudepu, N. Mburu',
    venue: 'EvalMG @ ACM SIGIR 2026 (Accepted)',
    year: '2026',
    description: 'Iterative multimodal generation degrades output quality in ways standard No-Reference Image Quality Assessment metrics fail to track. We propose DriftScore, an anchor-relative, trajectory-aware metric that measures quality drift against the original generation.',
    tags: ['Multimodal', 'NR-IQA', 'Deep Learning'],
    link: '',
  },
  {
    title: "Advancing Parkinson's Disease Management: From Dopaminergic Therapy to Deep Brain Stimulation and Beyond",
    authors: 'S. Loke',
    venue: 'Journal of Research High School (JRHS) · NEUROLOGY 2026',
    year: '2026',
    description: "A published narrative review of modern diagnostic and therapeutic strategies for Parkinson's disease, spanning dopaminergic therapy, deep brain stimulation, and biomarker-driven early detection within a biological, economic, and psychosocial framework.",
    tags: ['Neuroscience', 'Deep Brain Stimulation', 'Published'],
    link: '',
  },
]

// Positions & roles (Experience section; LANDER & Vivantal live in Projects)
export const experience = [
  {
    role: 'Researcher',
    company: 'Albert Einstein College of Medicine · Remote',
    period: 'Jan 2026 – Present',
    bullets: [
      'Innovating with large vision-language models (LVLMs) and deep learning across medical imaging projects.',
    ],
  },
  {
    role: 'Research Intern',
    company: 'University of Illinois Chicago · Hybrid',
    period: 'Nov 2025 – Present',
    bullets: [
      'Hands-on lab experience including cell culture.',
    ],
  },
  {
    role: 'Regional President',
    company: 'Project Pulmonary',
    period: 'May 2026 – Present',
    bullets: [
      'Promoting care for firefighters exposed to harmful carcinogens when fighting wildfires.',
    ],
  },
  {
    role: 'Chapter Development Director',
    company: 'Health For Humanity · Remote',
    period: 'Feb 2026 – Present',
    bullets: [
      'Helping develop chapters across the country for Health for Humanity. Raising awareness to younger children about CPR/AED.',
    ],
  },
  {
    role: 'Volunteer',
    company: 'Northwestern Medicine · On-site',
    period: 'May 2026 – Present',
    bullets: [
      'Assisting with administrative tasks and directing visitors to their locations.',
    ],
  },
  {
    role: 'Member',
    company: 'Neuroscience Journal Club, Stanford University · Remote',
    period: 'Aug 2025 – Present',
    bullets: [
      'Discuss and dissect current neuroscience research with a remote cohort.',
    ],
  },
  {
    role: 'Lead Intern',
    company: 'Leadership Initiatives Global Public Health Internship · Washington, DC',
    period: 'Aug 2024 – Present',
    bullets: [
      'Led a team of 3 researching health problems in underrepresented communities in Doka through surveys and data analysis.',
      'Designed health workshops and raised over $1,000 to support underdeveloped communities in Nigeria.',
    ],
  },
  {
    role: 'Volunteer (Cello & Companionship)',
    company: 'Angels Grace Hospice (Oswego, IL) · AccentCare (Naperville, IL)',
    period: 'May 2025 – Present',
    bullets: [
      'Provide companionship and play the cello for patients in a Memory Care Unit; assist with administrative work.',
    ],
  },
  {
    role: 'Student',
    company: 'UPenn Summer Academies · Philadelphia, PA',
    period: 'Jul 2025',
    bullets: [
      'Attended the Microbiology and Infectious Diseases Summer Academy, building hands-on lab skills.',
    ],
  },
]

export const awards = [
  {
    title: 'USA Biology Olympiad (USABO)',
    detail: 'Semifinalist (2026)',
  },
  {
    title: 'AMC 10 & AIME',
    detail: 'AMC 10A: 124.5 · AMC 10B: 127.5 · 2× Honor Roll · AIME Qualifier',
  },
  {
    title: 'ICTM Math Competition',
    detail: '2× State Qualifier · 11th Place, Geometry Individual at State (18/20)',
  },
  {
    title: 'HOSA Future Health Professionals',
    detail: 'State Leadership Conference Finalist, Medical Innovation',
  },
  {
    title: 'VEX Robotics Competition (V5RC)',
    detail: 'State Championship: Round of 16 with Team 2360Z (freshman), Quarterfinalist with Team 355Y (sophomore)',
  },
]

export const socials = [
  { label: 'Email', value: 'lokesathvik@gmail.com', href: 'mailto:lokesathvik@gmail.com' },
  { label: 'School Email', value: 'sloke@imsa.edu', href: 'mailto:sloke@imsa.edu' },
  { label: 'LinkedIn', value: 'linkedin.com/in/sathvik-loke', href: 'https://www.linkedin.com/in/sathvik-loke' },
]
