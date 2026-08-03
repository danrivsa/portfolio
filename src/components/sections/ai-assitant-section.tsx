import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Chat } from "../ai-chat";
import { ShineBorder } from "../ui/shine-border";

export default function AIAssistantSection() {
  return (
    
    <div>
        <div className="grid items-center justify-center gap-4 px-4 md:px-6 w-full py-12">
              <div className="space-y-3 text-center mb-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Meet my AI assistant
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Want to know more about me, my work, or how I can help your team? Chat with my personal AI assistant to get instant answers to your questions.
                </p>
              </div>
        </div>

        <div className="border rounded-xl relative">
        {/* <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
            <span className="text-background text-sm font-medium">AI Assistant</span>
        </div> */}
          <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden">
              <FlickeringGrid
              className="h-full w-full"
              squareSize={4}
              gridGap={6}
              color="#6B7280"
              maxOpacity={0.2}
              flickerChance={0.1}
              style={{
                  maskImage: "linear-gradient(to bottom, black, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
              }}
              />
          </div>
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} /> 
          <Chat/>
        </div>
    </div>
  );
}