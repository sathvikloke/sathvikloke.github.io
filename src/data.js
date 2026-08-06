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
  'Leadership', 'Research', 'Collaboration', 'Matplotlib',
  'Deep Learning', 'Machine Learning', 'Medical Imaging',
  'Python', 'Data Analysis', 'CPR Certified','Biology'
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
    tags: [],
    link: 'https://landeracl.com',
  },
  {
    title: 'Vivantal',
    description: "Co-founder. Healthcare has blind spots; Vivantal doesn't. Building tools to close the gaps in care.",
    tags: [],
    link: 'https://vivantal.com',
  },
]

// Research work (Research section)
export const research = [
  {
    title: 'Cohort-stratified prioritization of CRISPR–Cas9 sgRNAs for HDR-mediated correction of TP53 hotspot codons in cancer',
    authors: 'S. Loke*, N. S. V. Movva, M. Hota',
    venue: 'bioRxiv preprint',
    year: '2026',
    description: 'TP53 is mutated in roughly half of all human cancers. We prioritize CRISPR–Cas9 sgRNAs for HDR-mediated correction of recurrent TP53 hotspot codons, stratified across ovarian, pancreatic, and colorectal cancer cohorts.',
    tags: ['CRISPR', 'Genomics', 'Cancer'],
    link: 'https://www.biorxiv.org/content/10.64898/2026.05.20.726726v1',
  },
  {
    title: 'When Does Prompt-Perturbation Uncertainty Catch Interactive-Segmentation Failures? An Empirical Study on SAM/MedSAM',
    authors: 'S. Loke*, N. S. V. Movva, M. Hota, R. Gudepu, N. Mburu, S. Bestavemula',
    venue: 'UNSURE Workshop @ MICCAI 2026 (Poster) \u00b7 Springer LNCS',
    year: '2026',
    description: 'SAM and MedSAM take a click or box as a prompt but give clinicians no signal for when to trust the returned mask. We test whether jittering the prompt and measuring disagreement flags failures \u2014 it is the best catastrophic-failure detector on SAM, while medical fine-tuning recalibrates softmax and destroys the mask-quality head.',
    tags: ['Segmentation', 'Uncertainty', 'MICCAI'],
    link: 'https://openreview.net/pdf?id=cLehr9EUAP',
  },
  {
    title: 'What a slice-level benchmark certifies without the pixels: a label-file audit of seven public benchmarks',
    authors: 'S. Loke*, E. T. Johnson, N. S. V. Movva, A. Raut',
    venue: 'Zenodo preprint',
    year: '2026',
    description: 'Volumetric scans are labelled one slice at a time, so a benchmark score can be inflated by where a slice sits in the stack rather than what is in it. Using only four columns every benchmark already publishes \u2014 no image data at all \u2014 a pixel-blind classifier recovers a median 0.469 of the published margin over chance across seven benchmarks.',
    tags: ['Benchmarks', 'Medical Imaging', 'Reproducibility'],
    link: 'https://doi.org/10.5281/zenodo.21815040',
  },
  {
    title: 'DriftScore: An Anchor-Relative Metric for Detecting Quality Drift in Multi-Turn Multimodal Generation',
    authors: 'S. Loke*, N. S. V. Movva, R. Gudepu, N. Mburu',
    venue: 'EvalMG @ ACM SIGIR 2026 (Accepted)',
    year: '2026',
    description: 'Iterative multimodal generation degrades output quality in ways standard No-Reference Image Quality Assessment metrics fail to track. We propose DriftScore, an anchor-relative, trajectory-aware metric that measures quality drift against the original generation.',
    tags: ['Multimodal', 'NR-IQA', 'Deep Learning'],
    link: 'https://openreview.net/pdf?id=S6a4Gg4Z7J',
  },
  {
    title: "Advancing Parkinson's Disease Management: From Dopaminergic Therapy to Deep Brain Stimulation and Beyond",
    authors: 'S. Loke',
    venue: 'Journal of Research High School (JRHS) · NEUROLOGY 2026',
    year: '2026',
    description: "A published narrative review of modern diagnostic and therapeutic strategies for Parkinson's disease, spanning dopaminergic therapy, deep brain stimulation, and biomarker-driven early detection within a biological, economic, and psychosocial framework.",
    tags: ['Neuroscience', 'Deep Brain Stimulation', 'Published'],
    link: 'https://www.journalresearchhs.org/_files/ugd/ebf144_bc660d3935cc4f5597a3bfe3c31d5c48.pdf',
  },
]

// Positions & roles (Experience section; LANDER & Vivantal live in Projects)
export const experience = [
  {
    role: 'Researcher',
    company: 'Albert Einstein College of Medicine · Remote',
    period: 'Jan 2026 – Present',
    bullets: [
      'Innovating in medicine with machine learning.',
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
      'Patient Care and Healthcare workflow.',
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
