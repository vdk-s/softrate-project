const categoriesData = [
  {
    _id: 'cat-soft-dev',
    name: 'Software Development',
    slug: 'software-development',
    description: 'Architecture patterns, developer productivity, code quality, and engineering craft.',
    accentColor: '#0f62fe',
  },
  {
    _id: 'cat-aiml',
    name: 'Artificial Intelligence & Machine Learning',
    slug: 'artificial-intelligence-machine-learning',
    description: 'Neural networks, generative AI, LLMs, data quality frameworks, and predictive modeling.',
    accentColor: '#8a3ffc',
  },
  {
    _id: 'cat-web-mobile',
    name: 'Web and Mobile App Development',
    slug: 'web-mobile-app-development',
    description: 'Next-generation web applications, cross-platform mobile architecture, and responsive UX.',
    accentColor: '#0072c3',
  },
  {
    _id: 'cat-tech-inno',
    name: 'Technology & Innovation',
    slug: 'technology-innovation',
    description: 'Emerging tech frontiers, robotic automation, ESG alignment, and disruptive systems.',
    accentColor: '#ff832b',
  },
  {
    _id: 'cat-cyber',
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Threat intelligence, zero-trust architectures, AI defensive measures, and cryptography.',
    accentColor: '#da1e28',
  },
  {
    _id: 'cat-cloud',
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'Cloud-native paradigms, serverless systems, Kubernetes orchestration, and microservices.',
    accentColor: '#1192e8',
  },
  {
    _id: 'cat-industry',
    name: 'Industry Insights',
    slug: 'industry-insights',
    description: 'Macro technology trends, corporate digital transformation, and strategic market analyses.',
    accentColor: '#198038',
  },
];

const articlesData = [
  {
    _id: 'post-cybersecurity',
    title: 'AI-Driven Cybersecurity Threats: A Survey of Emerging Risks and Defensive Strategies',
    slug: 'ai-driven-cybersecurity-threats-defensive-strategies',
    category: categoriesData.find(c => c.slug === 'cybersecurity'),
    author: 'Sai Teja Erukude, Viswa Chaitanya Marella, Suhasnadh Reddy Veluru',
    readTime: '12 min read',
    publishedAt: '2026-01-06T00:00:00.000Z',
    excerpt: 'Examining deepfakes, adversarial attacks, and automated polymorphic malware, coupled with modern XDR and detection frameworks.',
    coverImage: '/assets/covers/cybersecurity.jpg',
    isFeatured: true,
    isTrending: true,
    views: 3105,
    status: 'published',
    tags: ['Cybersecurity', 'AI Threats', 'Deepfakes', 'Polymorphic Malware', 'XDR', 'Zero Trust'],
    seo: {
      metaTitle: 'AI-Driven Cybersecurity Threats & Defensive Strategies | Softrate',
      metaDescription: 'Comprehensive survey of AI cybersecurity threats: deepfakes, adversarial perturbation, polymorphic malware, and next-generation XDR defense pipelines.',
    },
    content: `## The Dual-Use Dilemma of Artificial Intelligence

Artificial Intelligence’s dual-use nature is revolutionizing the cybersecurity landscape. While defensive tools leverage machine learning for real-time anomaly detection, adversaries deploy generative AI to automate attacks with minimal human intervention.

This research paper surveys emerging risks across four critical attack categories:

---

## 1. Deepfakes and Synthetic Media

Deepfake incidents surged tenfold worldwide between 2022 and 2023. In North America and Asia-Pacific, biometric identity fraud incidents increased by 1740% and 1530% respectively.

### Real-World High-Profile Incidents:
- **UK Energy Subsidiary (2019):** $243,000 stolen via cloned CEO voice demanding immediate supplier transfer.
- **UAE Bank (2020):** $35 Million authorized via multi-modal cloned director voice and matching forged emails.
- **Multinational Executive (2024):** $25 Million defrauded in Hong Kong using real-time full-body video deepfakes during a multi-party Zoom conference.

\`\`\`python
# Weighted N-Gram Detection for Synthetic Text Phishing
def evaluate_linguistic_entropy(text_stream):
    tokens = tokenize(text_stream)
    entropy_score = calculate_shannon_entropy(tokens)
    return {
        "is_synthetic": entropy_score < 3.42,
        "confidence": min(1.0, (3.42 - entropy_score) / 1.5)
    }
\`\`\`

---

## 2. Adversarial Machine Learning Attacks

Adversarial attacks introduce subtle mathematical perturbations to input data that trick trained models into catastrophic misclassification while appearing completely normal to human observers.

| Attack Vector | Modality / Mechanism | Common Defensive Countermeasures |
| :--- | :--- | :--- |
| **FGSM & PGD** | Gradient-based pixel perturbation | Adversarial training, certified robustness bounds |
| **Data Poisoning** | Injecting malicious samples into training sets | Cryptographic data lineage, anomaly pruning |
| **Model Evasion** | Query flooding to reverse-engineer decision boundaries | Defensive distillation, rate-limiting APIs |

---

## 3. Automated Malware Generation & Polymorphism

Crimeware tools such as FraudGPT and WormGPT allow novice attackers to generate autonomous polymorphic malware. Modern malware payloads mutate their assembly structure every 30 to 60 seconds, bypassing static signature-based antivirus scanners.

### Defensive Engineering
- **Endpoint Detection and Response (EDR):** Continuous behavioral telemetry rather than static hash matching.
- **Extended Detection and Response (XDR):** Correlating network traffic, identity tokens, and kernel process execution.
- **User and Entity Behavior Analytics (UEBA):** Flagging anomalous access requests even with valid credentials.

## Conclusion & Strategic Recommendations

Defenders must adopt multi-modal explainable detection pipelines, conduct adversarial red-teaming benchmarks, and transition to strict Zero-Trust authentication architectures.`
  },
  {
    _id: 'post-industry-insights',
    title: 'A Systematic Review of Digital Transformation Literature (2013–2021) and the Development of an Overarching A-Priori Model to Guide Future Research',
    slug: 'systematic-review-digital-transformation-literature',
    category: categoriesData.find(c => c.slug === 'industry-insights'),
    author: 'Mekhala Egodawele, Darshana Sedera, Vinh Bui',
    readTime: '14 min read',
    publishedAt: '2022-01-15T00:00:00.000Z',
    excerpt: 'A critical synthesis of 174 peer-reviewed articles analyzing digital business transformation through the RC3O nomological net.',
    coverImage: '/assets/covers/industry-insights.png',
    isFeatured: true,
    isTrending: true,
    views: 1420,
    status: 'published',
    tags: ['Digital Transformation', 'Enterprise Strategy', 'RC3O Framework', 'Literature Review', 'Industry Insights'],
    seo: {
      metaTitle: 'Digital Transformation Systematic Literature Review (2013-2021) | Softrate',
      metaDescription: 'Critical synthesis of 174 peer-reviewed studies examining organizational digital transformation through the lens of the RC3O nomological framework.',
    },
    content: `## Abstract & Introduction

In recent times, organizations purport to undergo unprecedented transformations owing to the adoption of digital technologies. Consequently, there has been a substantial effort in academia attempting to better understand the phenomenon of digital transformation in business organizations. However, a cumulative tradition of research on digital transformation, underpinned by a consolidated theoretical positioning, is compromised by loosely defined constructs, confusion in terminology, and lack of an overarching framework of its nomological net.

This research features a systematic review of the assorted and fragmented literature on Digital Transformation by critically analyzing **174 peer-reviewed journal articles** published between 2013 and 2021 in over thirty leading academic outlets (including *BPMJ, CMR, JBR, JSIS, MISQ, and MS*).

> "Digital transformation is an evolutionary process that leverages digital capabilities and technologies to enable business models, operational processes and customer experiences to create value." — Morakanyane et al.

---

## Dominant Theoretical Foundations Evidenced in the Literature

### 1. Resource-Based View (RBV)
Firms achieve sustained competitive advantage utilizing a fusion of **Valuable, Rare, Imperfectly Imitable, and Non-Substitutable (VRIN)** resources and capabilities.

### 2. Dynamic Capabilities Theory
Firms sustain competitive advantage through continuous dynamic sensing, orchestration, and transformation routines.

### 3. Configuration Theory
Viewing the enterprise as constellations of mutually supportive organizational features that interact to accelerate business digitization.

---

## The RC3O Nomological Net

| Dimension | Scope & Core Elements | Key Academic Citations |
| :--- | :--- | :--- |
| **Resources (R)** | Resource availability, technological assets, financial capital | Becker & Schmid (2020) |
| **Capabilities (C1)** | Digital responsibilities, strategic expertise, architectural agility | Bharadwaj et al. (2013) |
| **Considerations (C2)** | Economic, social, environmental sustainability, legal, and privacy constraints | Soluk & Kammerlander (2021) |
| **Contexts (C3)** | Firm size (SME vs. LSE), regional maturity, developing vs. developed markets | Quinn et al. (2016) |
| **Outcomes (O)** | Competitive advantage, new revenue streams, operational efficiency | Park & Mithas (2020) |`
  },
  {
    _id: 'post-cloud-computing',
    title: 'Cloud-Native Computing: A Survey from the Perspective of Services',
    slug: 'cloud-native-computing-survey-services',
    category: categoriesData.find(c => c.slug === 'cloud-computing'),
    author: 'Shuiguang Deng, Hailiang Zhao, Binbin Huang, Cheng Zhang, Feiyi Chen, Yinuo Deng, Jianwei Yin, Schahram Dustdar, Albert Y. Zomaya',
    readTime: '22 min read',
    publishedAt: '2023-06-26T00:00:00.000Z',
    excerpt: 'Deconstructing the life-cycle of cloud-native applications across building, orchestration, operation, and maintenance states.',
    coverImage: '/assets/covers/cloud-computing.png',
    isFeatured: true,
    isTrending: false,
    views: 2840,
    status: 'published',
    tags: ['Cloud Computing', 'Microservices', 'Kubernetes', 'Serverless', 'Service Mesh', 'CNCF'],
    seo: {
      metaTitle: 'Cloud-Native Computing Survey: Service Lifecycle | Softrate',
      metaDescription: 'A systematic survey of cloud-native computing across building, orchestration, operation, and maintenance states by IEEE fellow researchers.',
    },
    content: `## Introduction: The Cloud-Native Revolution

In accordance with the **Cloud Native Computing Foundation (CNCF)**, cloud-native is the collection of technologies that break down applications into microservices and package them in lightweight containers to be deployed and orchestrated across scalable server clusters.

---

## 1. Computation, Network, & Storage Virtualization

| Virtualization Type | Technology Highlights | Key Advantages | Production Examples |
| :--- | :--- | :--- | :--- |
| **Type 1 Hypervisor** | Bare-metal hypervisor directly on hardware | High performance, unmodified OS | VMware ESXi, Hyper-V |
| **Containers** | Userland OS virtualization with shared kernel | Low overhead, sub-second boot | Docker, containerd, CRI-O |

### Network Virtualization & Service Mesh
The **Sidecar Pattern** (exemplified by Envoy and Istio) intercepts traffic transparently without application code modification.

\`\`\`yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: payment-service-routing
spec:
  hosts:
    - payment.softrate.internal
  http:
    - route:
        - destination:
            host: payment.softrate.internal
            subset: v1
\`\`\`

## 2. Auto-Scaling & Load Balancing
- **Horizontal Pod Autoscaling (HPA):** Dynamically scales replica count based on CPU, memory, and custom Prometheus metrics.
- **Failure Recovery:** Automated health-checks, circuit-breakers, and fast container respawning.`
  },
  {
    _id: 'post-technology-innovation',
    title: 'Robotic Process Automation as a Driver for Sustainable Innovation and Entrepreneurship',
    slug: 'rpa-driver-sustainable-innovation-entrepreneurship',
    category: categoriesData.find(c => c.slug === 'technology-innovation'),
    author: 'Petr Průcha',
    readTime: '8 min read',
    publishedAt: '2023-03-15T00:00:00.000Z',
    excerpt: 'Investigating the statistical association between RPA adoption and corporate ESG ratings among top global enterprises.',
    coverImage: '/assets/covers/technology-innovation.jpg',
    isFeatured: false,
    isTrending: true,
    views: 1890,
    status: 'published',
    tags: ['RPA', 'Sustainable Innovation', 'ESG', 'Process Automation', 'Digital Efficiency'],
    seo: {
      metaTitle: 'Robotic Process Automation (RPA) & Sustainable ESG Innovation | Softrate',
      metaDescription: 'Empirical investigation into the direct relationship between enterprise RPA deployment and corporate ESG ratings among the top 300 global enterprises.',
    },
    content: `## Introduction: Beyond Cost-Cutting

Robotic Process Automation (RPA) is frequently evaluated solely through the prism of operational cost-cutting and headcount reduction. However, empirical corporate evidence suggests that software bot orchestration serves as an essential driver for environmental, social, and governance (ESG) performance.

### Statistical Evaluation
From the world's 300 largest corporations, **256 enterprises (85.3%) utilize RPA technology**, while 44 do not.

\`\`\`
Pearson's Chi-Square Test of Independence:
X² = 6.54, p = 0.0381 (Significant at α = 0.05 level)
\`\`\`

The test establishes a statistically significant dependency between RPA adoption and corporate ESG ratings.

---

## The Three Pillars of Sustainable Automation
- **Environmental (E):** Paperless digital transition and energy-aware compute batch scheduling.
- **Social (S):** Relieving knowledge workers from soul-crushing data entry to focus on high-value creative problem solving.
- **Governance (G):** 100% deterministic, immutable audit logs eliminating compliance drift and human fraud.`
  },
  {
    _id: 'post-web-mobile',
    title: 'Software Engineering for Mobile Applications: A Survey on Challenges and Solutions',
    slug: 'software-engineering-mobile-applications-challenges',
    category: categoriesData.find(c => c.slug === 'web-mobile-app-development'),
    author: 'Shehab Eldeen Ayman Mounir',
    readTime: '11 min read',
    publishedAt: '2020-05-18T00:00:00.000Z',
    excerpt: 'Analyzing cross-platform fragmentation, context-awareness, and the translation of Shneiderman’s Golden Rules to mobile interfaces.',
    coverImage: '/assets/covers/mobile-applications.png',
    isFeatured: false,
    isTrending: false,
    views: 2210,
    status: 'published',
    tags: ['Mobile Engineering', 'React Native', 'Android', 'iOS', 'UI/UX Design', 'Performance'],
    seo: {
      metaTitle: 'Mobile Software Engineering: Challenges and Solutions | Softrate',
      metaDescription: 'Technical survey examining mobile operating system fragmentation, context-awareness, cross-platform frameworks, and Shneiderman design rules.',
    },
    content: `## The Mobile Engineering Paradigm Shift

Mobile devices operate under severe physical constraints: erratic connectivity, volatile thermal throttling, aggressive OS memory managers, and sensory overload.

---

## Core Engineering Challenges
1. **Device Fragmentation:** Coping with hundreds of screen resolutions, aspect ratios, CPU architectures, and custom vendor Android skins.
2. **Native vs. Cross-Platform:** Balancing raw hardware access with development velocity across React Native, Flutter, Swift, and Kotlin.

\`\`\`typescript
export function useMobileSensorContext() {
  const [isLowPower, setIsLowPower] = useState(false);
  useEffect(() => {
    const sub = Battery.addLevelListener(({ level }) => setIsLowPower(level < 0.20));
    return () => sub.remove();
  }, []);
  return { isLowPower };
}
\`\`\`

## Shneiderman’s Eight Golden Rules for Mobile
- **Consistency:** Respect platform UX conventions.
- **Informative Feedback:** Tactile and visual micro-animations under 16ms (60 FPS).
- **Error Reversal:** Non-blocking undo snackbars for destructive actions.`
  },
  {
    _id: 'post-aiml',
    title: 'A Survey on Data Quality Dimensions and Tools for Machine Learning',
    slug: 'data-quality-dimensions-tools-machine-learning',
    category: categoriesData.find(c => c.slug === 'artificial-intelligence-machine-learning'),
    author: 'Yuhan Zhou, Fengjiao Tu, Junhua Ding, Kewei Sha, Haihua Chen',
    readTime: '15 min read',
    publishedAt: '2024-06-28T00:00:00.000Z',
    excerpt: 'A comprehensive roadmap comparing open-source data quality tools and their impact on data-centric AI workflows.',
    coverImage: '/assets/covers/aiml.jpg',
    isFeatured: false,
    isTrending: true,
    views: 2650,
    status: 'published',
    tags: ['Data Quality', 'Machine Learning', 'DataOps', 'Great Expectations', 'Feature Store'],
    seo: {
      metaTitle: 'Data Quality Dimensions and Tools for Machine Learning | Softrate',
      metaDescription: 'A systematic survey of 17 open-source data quality tools and the 4 foundational dimensions of data-centric AI by University of North Texas researchers.',
    },
    content: `## The Imperative of Data-Centric AI

Data quality (DQ) is critical for the performance, fairness, robustness, safety, and scalability of machine learning models. Improving dataset quality yields substantially greater returns than endlessly tuning model hyperparameters.

---

## The Four Core Data Quality Dimensions
1. **Intrinsic:** Correctness, duplication elimination, trustworthiness.
2. **Contextual:** Completeness, comprehensiveness, class balance.
3. **Representational:** Schema uniformity, conformity, consistency.
4. **Accessibility:** Availability, secure auditing, access controls.

\`\`\`python
import great_expectations as gx

context = gx.get_context()
validator = context.sources.pandas_default.read_csv("training_set.csv")
validator.expect_column_values_to_not_be_null(column="user_id")
results = validator.validate()
assert results.success
\`\`\``
  },
  {
    _id: 'post-software-dev',
    title: 'Towards a Theory of Software Development Expertise',
    slug: 'theory-software-development-expertise',
    category: categoriesData.find(c => c.slug === 'software-development'),
    author: 'Sebastian Baltes, Stephan Diehl',
    readTime: '16 min read',
    publishedAt: '2018-11-04T00:00:00.000Z',
    excerpt: 'A grounded theory connecting deliberate practice, continuous learning, mentoring, and code quality in software engineering.',
    coverImage: '/assets/covers/software-development.jpg',
    isFeatured: false,
    isTrending: false,
    views: 3410,
    status: 'published',
    tags: ['Software Engineering', 'Developer Productivity', 'Expertise Theory', 'Mentorship', 'Code Quality'],
    seo: {
      metaTitle: 'Towards a Theory of Software Development Expertise | Softrate',
      metaDescription: 'A grounded theory by Baltes and Diehl defining software development expertise through deliberate practice, mentoring, continuous learning, and self-reflection.',
    },
    content: `## What Distinguishes an "Expert" Software Developer?

Years on a resume correlate weakly with true development expertise after the first two years. Through empirical research across GitHub and Stack Overflow developers, Baltes and Diehl constructed a conceptual theory of development expertise.

---

## The Four Foundational Pillars
1. **Knowledge Depth & Breadth:** Language design philosophy combined with algorithm and architecture fluency.
2. **Deliberate Practice:** Seeking tasks of increasing difficulty and actively participating in critical code reviews.
3. **Cognitive Abstraction:** Pragmatic trade-offs over dogmatic perfectionism.
4. **Mentorship:** Elevating team velocity and cultivating psychological safety.

## Implications for Engineering Culture
Eliminate superficial metrics (raw commit counts, lines of code) which trigger Goodhart's Law. Formalize deliberate learning time and reward engineers who simplify architectures.`
  }
];

module.exports = { categoriesData, articlesData };

