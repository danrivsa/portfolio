import { AnimatedGridPattern } from "@/components/animated-grid-pattern";
import { DotPattern } from "@/components/dot-pattern";
import { IconCloud } from "@/components/dynamic-icon-cloud";
import { HackathonCard } from "@/components/hackathon-card";
import { LangSwipper } from "@/components/lang-swipper";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { ShineBorder } from "@/components/shine-border";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Markdown from "react-markdown";
import Flag from "react-world-flags";
import Image from 'next/image'

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="hero">
        {/* <DotPattern
        width={20}
        height={50}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom,white,transparent,transparent)] ",
        )}
      /> */}
        <AnimatedGridPattern
          numSquares={100}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        />
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
              />
              <BlurFadeText
                className="max-w-[600px] md:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>
      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">About</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            {DATA.summary}
          </Markdown>
        </BlurFade>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </BlurFade>
          {DATA.work.map((work, id) => (
            <BlurFade
              key={work.company}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            >
              <ResumeCard
                key={work.company}
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                badges={work.badges}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">Education</h2>
          </BlurFade>
          {DATA.education.map((education, id) => (
            <BlurFade
              key={education.school}
              delay={BLUR_FADE_DELAY * 8 + id * 0.05}
            >
              <ResumeCard
                key={education.school}
                href={education.href}
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                subtitle={education.degree}
                period={`${education.start} - ${education.end}`}
              />
            </BlurFade>
          ))}
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3 justify-center text-center">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <div className="space-y-2 mb-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Hard Skills
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-4">
                As a software engineer and computer scientist, I possess a
                strong foundation in various programming languages, frameworks
                and technologies. Here are some of my key technical skills
              </p>
            </div>
          </BlurFade>
          <div className="flex flex-wrap gap-1 sm:justify-center xs:justify-center md:justify-start">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
          <div className="flex justify-center">
            <BlurFade delay={BLUR_FADE_DELAY * 10}>
              <IconCloud iconSlugs={DATA.skills_slugs as any}></IconCloud>
            </BlurFade>
          </div>
        </div>
      </section>
      {/* <section id="projects">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  My Projects
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Check out my latest work
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  I&apos;ve worked on a variety of projects, from simple
                  websites to complex web applications. Here are a few of my
                  favorites.
                </p>
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
            {DATA.projects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              >
                <ProjectCard
                  href={project.href}
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={project.links}
                />
              </BlurFade>
            ))}
          </div>
        </div>
      </section> */}
      <section id="soft_skills">
        <div className="space-y-12 w-full py-7">
          <BlurFade delay={BLUR_FADE_DELAY * 10}>
            <div className="space-y-2 mb-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Soft Skills
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-4">
                Beyond technical expertise, I am a collaborative team player
                with strong communication and problem-solving skills. Here are
                some of my key soft skills
              </p>
            </div>
          </BlurFade>
        </div>
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <h2 className="text-xl font-bold mb-4">Interpersonal Skills</h2>
        </BlurFade>
        <div className="flex flex-wrap gap-1 mb-10 sm:justify-center xs:justify-center md:justify-start">
          {DATA.interpersonal_skills.map((skill, id) => (
            <BlurFade key={skill} delay={BLUR_FADE_DELAY * 11 + id * 0.05}>
              <Badge key={skill}>{skill}</Badge>
            </BlurFade>
          ))}
        </div>
        <BlurFade delay={BLUR_FADE_DELAY * 12}>
          <h2 className="text-xl font-bold mb-4">Personal Qualities</h2>
        </BlurFade>
        <div className="flex flex-wrap mb-6 gap-1 sm:justify-center xs:justify-center md:justify-start">
          {DATA.personal_qualities.map((skill, id) => (
            <BlurFade key={skill} delay={BLUR_FADE_DELAY * 12 + id * 0.05}>
              <Badge key={skill}>{skill}</Badge>
            </BlurFade>
          ))}
        </div>
      </section>
      <section id="photos">
        <div className="columns-2 gap-4 sm:columns-3">
          {DATA.photos.map((p, idx) => {
            return (
              <BlurFade delay={BLUR_FADE_DELAY * 12.5 + idx * 0.05} key={idx}>
                <img
                  alt='pic'
                  loading="lazy"
                  decoding="async"
                  data-nimg="1"
                  style={{ color: "transparent" }}
                  className="aspect-w-16 aspect-h-9 mb-4 w-full rounded-lg object-cover"
                  src={p.photo_file}
                ></img>
              </BlurFade>
            );
          })}
        </div>
      </section>
      <section id="gamejams">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                {/* <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  Game jams
                </div> */}
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Additional Skills
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  During my time in university, I attended{" "}
                  {DATA.gamejams.length}+ game jams. People from around the
                  country would come together and build amazing games in 2-3
                  days.
                </p>
              </div>
            </div>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 14}>
            <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
              {DATA.gamejams.map((project, id) => (
                <BlurFade
                  key={project.title + project.dates}
                  delay={BLUR_FADE_DELAY * 15 + id * 0.05}
                >
                  <HackathonCard
                    title={project.title}
                    description={project.description}
                    location={project.location}
                    dates={project.dates}
                    image={project.image}
                    links={project.links}
                  />
                </BlurFade>
              ))}
            </ul>
          </BlurFade>
        </div>
      </section>
      <section id="languages">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6  py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 2.5}>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-3">
              Adaptable Communicator
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-10">
              Leveraging language skills to overcome language barriers and find
              innovative solutions.
            </p>
            <div className="flex justify-center flex-wrap gap-3">
              <LangSwipper blur_delay={BLUR_FADE_DELAY}></LangSwipper>
              {/* {DATA.languages.map((lang, index) => (
                <BlurFade delay={BLUR_FADE_DELAY * index} key={lang.name}>
                  <ShineBorder  color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
                    <div className="bg-background text-foreground" style={{borderRadius:7, width:'100%', padding:'2rem', display:'flex', flexDirection:'column', height:'auto'}} >
                      <div className="container">
                        <div className="flex-col">
                          <Flag code={lang.code}></Flag>
                        </div>
                        <div className="flex-col">
                          <p>{lang.name}</p>
                          <p className="text-xs">{lang.level}&nbsp;{lang.category}</p>
                        </div>
                      </div>
                    </div>
                  </ShineBorder>
                </BlurFade>
              ))} */}
            </div>
          </BlurFade>
        </div>
      </section>

      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="space-y-3">
              {/* <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                Contact
              </div> */}
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Get in Touch
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Want to chat? Just{" "}
                <Link
                  href={DATA.contact.social.LinkedIn.url}
                  className="text-blue-500 hover:underline"
                >
                  Shoot me with a dm on LinkedIn
                </Link>{" "}
                and I&apos;ll respond whenever I can.
              </p>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
