import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { RoleShowcase } from "@/components/home/role-showcase";
import { PlatformFeatures } from "@/components/home/platform-features";
import { LatestBlogs } from "@/components/home/latest-blogs";
import { CtaSection } from "@/components/home/cta-section";
import { Footer } from "@/components/home/footer";

export const metadata = {
  title: "Scholler LMS - Master In-Demand Engineering & Accelerate Your Career",
  description:
    "Next-Gen Learning Management System featuring multi-role RBAC, interactive video courses, rich Markdown curricula, and auto-graded assessments.",
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background selection:bg-primary/20 selection:text-primary min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <FeaturedCourses />
        <RoleShowcase />
        <PlatformFeatures />
        <LatestBlogs />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
