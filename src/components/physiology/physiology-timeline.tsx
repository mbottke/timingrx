"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { weekByWeekPhysiology } from "@/data/physiologic";

const WEEKS = [39, 40, 41, 42] as const;

const CARD_FIELDS = [
  { key: "placenta" as const, label: "Placenta" },
  { key: "amnioticFluid" as const, label: "Amniotic Fluid" },
  { key: "meconium" as const, label: "Meconium" },
  { key: "fetalGrowth" as const, label: "Fetal Growth" },
  { key: "hormonal" as const, label: "Hormonal" },
];

const WEEK_STYLES: Record<number, string> = {
  39: "border-emerald-500/30 bg-emerald-500/5",
  40: "border-amber-500/30 bg-amber-500/5",
  41: "border-orange-500/30 bg-orange-500/5",
  42: "border-red-500/30 bg-red-500/5",
};

const WEEK_BUTTON_ACTIVE: Record<number, string> = {
  39: "bg-emerald-500 text-white hover:bg-emerald-600",
  40: "bg-amber-500 text-white hover:bg-amber-600",
  41: "bg-orange-500 text-white hover:bg-orange-600",
  42: "bg-red-500 text-white hover:bg-red-600",
};

export function PhysiologyTimeline() {
  const [selectedWeek, setSelectedWeek] = useState(39);

  const weekData = weekByWeekPhysiology.find(
    (d) => d.ga === selectedWeek * 7
  );

  return (
    <div className="space-y-6">
      {/* Step bar */}
      <div className="flex items-center justify-center gap-2">
        {WEEKS.map((week) => (
          <Button
            key={week}
            variant={selectedWeek === week ? "default" : "outline"}
            size="sm"
            className={
              selectedWeek === week
                ? WEEK_BUTTON_ACTIVE[week]
                : "text-muted-foreground"
            }
            onClick={() => setSelectedWeek(week)}
          >
            {week}w
          </Button>
        ))}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        {weekData && (
          <motion.div
            key={selectedWeek}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {CARD_FIELDS.map(({ key, label }) => (
              <Card
                key={key}
                className={`border ${WEEK_STYLES[selectedWeek]}`}
              >
                <CardHeader>
                  <CardTitle className="text-sm">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {weekData[key]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
