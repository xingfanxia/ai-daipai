"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PackageGrid } from "./package-grid";
import { InspirationPicker } from "./inspiration-picker";
import { ScenePicker } from "./scene-picker";
import { StylePicker } from "./style-picker";
import { OutfitPicker } from "./outfit-picker";
import { MoodPicker } from "./mood-picker";
import { PhotoCountSlider } from "./photo-count-slider";

export function CustomizeStep() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">自定义风格</h2>
        <p className="text-sm text-muted-foreground">
          Choose a quick preset or fully customize your photoshoot
        </p>
      </div>

      <Tabs defaultValue="quick">
        <TabsList className="w-full">
          <TabsTrigger value="quick" className="flex-1">
            快速开始 Quick Start
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex-1">
            自定义 Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="mt-4">
          <PackageGrid />
        </TabsContent>

        <TabsContent value="custom" className="mt-4">
          <div className="flex flex-col gap-6">
            {/* Inspiration — 抄作业 */}
            <section>
              <h3 className="mb-3 text-base font-semibold">
                💡 灵感图 Inspiration
              </h3>
              <InspirationPicker />
            </section>

            <Separator />

            {/* Scene */}
            <section>
              <h3 className="mb-3 text-base font-semibold">
                场景 Scene
              </h3>
              <ScenePicker />
            </section>

            <Separator />

            {/* Style */}
            <section>
              <h3 className="mb-3 text-base font-semibold">
                风格 Style
              </h3>
              <StylePicker />
            </section>

            <Separator />

            {/* Outfit */}
            <section>
              <h3 className="mb-3 text-base font-semibold">
                服装 Outfit
              </h3>
              <OutfitPicker />
            </section>

            <Separator />

            {/* Mood */}
            <section>
              <h3 className="mb-3 text-base font-semibold">
                情绪 Mood
              </h3>
              <MoodPicker />
            </section>

            <Separator />

            {/* Photo count */}
            <section>
              <h3 className="mb-3 text-base font-semibold">
                数量 Photo Count
              </h3>
              <PhotoCountSlider />
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
