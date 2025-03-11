import { Icons } from "@/components/icons";
import { BellIcon } from "@radix-ui/react-icons";
import { Gamepad, HomeIcon, MessageCircleMoreIcon } from "lucide-react";
import { title } from "process";

export const DATA = {
  name: "Daniel Rivero",
  initials: "DR",
  url: "http://localhost:3000",
  location: "San Francisco, CA",
  locationLink: "https://www.google.com/maps/place/sanfrancisco",
  description:
    "Software engineer and AI enthusiast. I love building innovative solutions and explore new tech trends",
  summary:
    "I'm a motivated software engineer with a passion for building innovative solutions. I'm skilled in [architecting robust cloud solutions on AWS and leveraging state-of-the-art technologies](/portfolio/#skills). With a [background in computer science](/portfolio/#education), I bring a unique perspective to problem-solving and software development. I also have experience in game development through [numerous game jams i participated just for fun](/portfolio/#gamejams).",
  avatarUrl: "./me.png",
  languages: [
    {
      name: "Spanish",
      level: "Native",
      category: "C2",
      code: "esp",
      // url:'https://www.all-flags-world.com/country-flag/Spain/flag-spain-XL.jpg'
      url: "./vzla.jpg",
    },
    {
      name: "English",
      level: "Bilingual",
      category: "C2",
      code: "gb",
      url: "./usa.jpg",
    },
    {
      name: "French",
      level: "Intermediate",
      category: "A2",
      code: "fr",
      url: "./fr.jpg",
    },
  ],
  skills: [
    "React",
    "Angular",
    "Vue",
    "HTML5",
    "CSS3",
    "Next.js",
    "Node.js",
    "RxJS",
    "Python",
    "PostgresSQL",
    "GraphQL",
    "MySQL",
    "Docker",
    "AWS",
    "Java",
    "Javascript",
    "Typescript",
    "C",
    "C#",
    "Jest",
    "Mocha",
    "Cypress",
    "Dart",
    "Flutter",
    "Android studio",
    "Git",
    "Github",
    "Gitlab",
    "Jira",
    "Firebase",
    "Vercel",
    "Pytorch",
    "Tensorflow",
    "Jupyter",
    "Stripe",
    "GoDaddy",
    "CPanel",
    "Arduino",
    "Python",
    "Numpy",
    "Pandas",
    "Keras",
    "Unity",
    "Godot",
    "RabittMQ",
  ],
  skills_slugs: [
    "typescript",
    "javascript",
    "dart",
    "java",
    "react",
    "flutter",
    "android",
    "html5",
    "css3",
    "express",
    "amazonaws",
    "postgresql",
    "mysql",
    "graphql",
    "firebase",
    "vercel",
    "jest",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "figma",
    "dotenv",
    "angular",
    "vuedotjs",
    "react",
    "pytorch",
    "tensorflow",
    "jupyter",
    "stripe",
    "godaddy",
    "cpanel",
    "arduino",
    "python",
    "numpy",
    "pandas",
    "keras",
    "unity",
    "godotengine",
    "c",
    "csharp",
    "nextdotjs",
    "nodejs",
    "rabbitmq",
    "reactivex",
  ],
  interpersonal_skills: [
    "Effective Communication",
    "Active Listening",
    "Empathy",
    "Teamwork",
    "Conflict Resolution",
  ],
  personal_qualities: [
    "Resilience",
    "Self-Awareness",
    "Problem-Solving",
    "Critical Thinking",
    "Creativity",
    "Work Ethic",
  ],
  photos: [
    {
     photo_file:'./1.jpg'
    },
    {
     photo_file:'./2.jpg'
    },
    {
     photo_file:'./3.jpg'
    },
    {
     photo_file:'./4.jpg'
    },
    {
     photo_file:'./5.jpg'
    },
    {
     photo_file:'./6.jpg'
    }
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    // { href: "/blog", icon: MessageCircleMoreIcon, label: "Chat" },
  ],
  contact: {
    email: "danielrivero2000@gmail.com",
    tel: "+584241252703",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/danrivsa",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/danrivsa/",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/danrivsa",
        icon: Icons.x,

        navbar: true,
      },
      // Youtube: {
      //   name: "Youtube",
      //   url: "https://dub.sh/dillion-youtube",
      //   icon: Icons.youtube,
      //   navbar: true,
      // },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  work: [
    {
      company: "MX Global Center",
      href: "https://mxglobal.center/",
      badges: [],
      location: "Remote",
      title: "Software Engineer",
      logoUrl: "./mx-global.png",
      start: "Oct 2024",
      end: undefined,
      description:
        "As a Software Engineer at MX Global Center, I focused on enhancing operational efficiency and streamlining processes. I was instrumental in maintaining and optimizing critical infrastructure components, implementing innovative software solutions and APIs to automate repetitive tasks. I leveraged my expertise in Angular and Xano to develop custom applications, including an ETL process to automate manual journal calculations. By automating these tasks, I significantly reduced operational costs, increased accuracy, and improved overall productivity.",
    },
    {
      company: "Newtoms LLC",
      badges: [],
      href: "https://www.newtoms.com/",
      location: "Remote",
      title: "Jr. Software Developer and Cloud Solutions Architect",
      logoUrl: "./newtoms.png",
      start: "Jan 2023",
      end: undefined,
      description:
        "During my time at Newtoms LLC, I was involved in the development of innovative products, including Avatar X and Virtual Staging. I utilized Angular and AWS to build scalable and efficient solutions. For my thesis project, I architected a semi-real-time smart surveillance system that leveraged AWS services like Rekognition Custom Labels, Kinesis Video Streams, SageMaker, S3, CloudFront, API Gateway, Cognito, AppSync, Amplify, and a GraphQL API to detect and analyze incidents in real-time. The system incorporated computer vision and audio analysis techniques to identify persons, weapons, fires, and gunshots. Real-time notifications were delivered using AppSync, and the processing of video streams was streamlined through a serverless architecture utilizing multiple Lambda functions and event-driven communication via SQS and SNS. Docker containers were used to handle image processing with OpenCV and to connect the camera to the AWS cloud.",
    },
    {
      company: "PwC Venezuela",
      href: "https://www.pwc.com/ve/es.html",
      badges: [],
      location: "Hybrid",
      title: "Assocciate (RAS) and Jr. Software Developer",
      logoUrl: "./pwc.png",
      start: "Mar 2021",
      end: "Dec 2022",
      description:
        "At PwC Venezuela, I was responsible for maintaining and developing new features for the company’s self-improvement platform. This web application, built with Angular, Express, and Microsoft SQL Server, automates various manual tasks across different departments. I played a key role in developing a module to manage the client base and automate the lifecycle and budget management of audit projects, leading to significant efficiency gains for over five departments.",
    },
  ],
  education: [
    {
      school: "Catholic University Andrés Bello",
      href: "https://www.ucab.edu.ve/",
      degree: "Bachelor's Degree in Computer Science",
      logoUrl: "./ucab.png",
      start: "2017",
      end: "2023",
    },
  ],
  // projects: [
  //   {
  //     title: "Chat Collect",
  //     href: "https://chatcollect.com",
  //     dates: "Jan 2024 - Feb 2024",
  //     active: true,
  //     description:
  //       "With the release of the [OpenAI GPT Store](https://openai.com/blog/introducing-the-gpt-store), I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.",
  //     technologies: [
  //       "Next.js",
  //       "Typescript",
  //       "PostgreSQL",
  //       "Prisma",
  //       "TailwindCSS",
  //       "Stripe",
  //       "Shadcn UI",
  //       "Magic UI",
  //     ],
  //     links: [
  //       {
  //         type: "Website",
  //         href: "https://chatcollect.com",
  //         icon: <Icons.globe className="size-3" />,
  //       },
  //     ],
  //     image: "",
  //     video:
  //       "https://pub-83c5db439b40468498f97946200806f7.r2.dev/chat-collect.mp4",
  //   },
  //   {
  //     title: "Magic UI",
  //     href: "https://magicui.design",
  //     dates: "June 2023 - Present",
  //     active: true,
  //     description:
  //       "Designed, developed and sold animated UI components for developers.",
  //     technologies: [
  //       "Next.js",
  //       "Typescript",
  //       "PostgreSQL",
  //       "Prisma",
  //       "TailwindCSS",
  //       "Stripe",
  //       "Shadcn UI",
  //       "Magic UI",
  //     ],
  //     links: [
  //       {
  //         type: "Website",
  //         href: "https://magicui.design",
  //         icon: <Icons.globe className="size-3" />,
  //       },
  //       {
  //         type: "Source",
  //         href: "https://github.com/magicuidesign/magicui",
  //         icon: <Icons.github className="size-3" />,
  //       },
  //     ],
  //     image: "",
  //     video: "https://cdn.magicui.design/bento-grid.mp4",
  //   },
  //   {
  //     title: "llm.report",
  //     href: "https://llm.report",
  //     dates: "April 2023 - September 2023",
  //     active: true,
  //     description:
  //       "Developed an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts.",
  //     technologies: [
  //       "Next.js",
  //       "Typescript",
  //       "PostgreSQL",
  //       "Prisma",
  //       "TailwindCSS",
  //       "Shadcn UI",
  //       "Magic UI",
  //       "Stripe",
  //       "Cloudflare Workers",
  //     ],
  //     links: [
  //       {
  //         type: "Website",
  //         href: "https://llm.report",
  //         icon: <Icons.globe className="size-3" />,
  //       },
  //       {
  //         type: "Source",
  //         href: "https://github.com/dillionverma/llm.report",
  //         icon: <Icons.github className="size-3" />,
  //       },
  //     ],
  //     image: "",
  //     video: "https://cdn.llm.report/openai-demo.mp4",
  //   },
  //   {
  //     title: "Automatic Chat",
  //     href: "https://automatic.chat",
  //     dates: "April 2023 - March 2024",
  //     active: true,
  //     description:
  //       "Developed an AI Customer Support Chatbot which automatically responds to customer support tickets using the latest GPT models.",
  //     technologies: [
  //       "Next.js",
  //       "Typescript",
  //       "PostgreSQL",
  //       "Prisma",
  //       "TailwindCSS",
  //       "Shadcn UI",
  //       "Magic UI",
  //       "Stripe",
  //       "Cloudflare Workers",
  //     ],
  //     links: [
  //       {
  //         type: "Website",
  //         href: "https://automatic.chat",
  //         icon: <Icons.globe className="size-3" />,
  //       },
  //     ],
  //     image: "",
  //     video:
  //       "https://pub-83c5db439b40468498f97946200806f7.r2.dev/automatic-chat.mp4",
  //   },
  // ],
  gamejams: [
    {
      title: "Global Game Jam",
      dates: "January 23rd - 25th, 2018",
      location: "Caracas, Venezuela",
      description:
        "Developed a dungeon crawler game using the Unity Game Engine and C#",
      image: "./gamejam-logo.svg",
      mlh: "",
      links: [
        {
          title: "Pollicia del espacio",
          href: "https://v3.globalgamejam.org/2018/games/pollicia-del-espacio",
        },
      ],
    },
    {
      title: "Extra Credits Game Jam",
      dates: "December 16th - 18th, 2018",
      location: "Remote",
      description:
        "Developed a 2D Shooter game with a christmas topic with the Unity Game Engine and C#",
      image: "./extra-credits.png",
      mlh: "",
      links: [
        {
          title: "Mayhem on Xmas",
          href: "https://kegnor.itch.io/mayhem-on-christmas",
        },
      ],
    },
    {
      title: "Global Game Jam",
      dates: "January 27th - 29th, 2019",
      location: "Caracas, Venezuela",
      description:
        "Developed an story based game inspired in Gone home using the Unity Game Engine and C#",
      image: "./gamejam-logo.svg",
      mlh: "",
      links: [
        {
          title: "House of memories",
          href: "https://danrivsa.itch.io/house-of-memories",
        },
      ],
    },
    {
      title: "Extra Credits Game Jam",
      dates: "August 27th - 29th, 2019",
      location: "Remote",
      description:
        "Developed a game based on charon's passage through the styx river with the Unity Game Engine and C#",
      image: "./extra-credits.png",
      mlh: "",
      links: [
        {
          title: "Charon's passage",
          href: "https://kegnor.itch.io/charons-passage",
        },
      ],
    },
  ],
} as const;
