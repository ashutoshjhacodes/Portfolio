import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';
import ImpactDashboard from '@/components/sections/ImpactDashboard';
import AboutSection from '@/components/sections/AboutSection';
import TechnicalLeadership from '@/components/sections/TechnicalLeadership';
import ArchitecturePrinciples from '@/components/sections/ArchitecturePrinciples';
import ExperienceTimeline from '@/components/sections/ExperienceTimeline';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import AIEngineering from '@/components/sections/AIEngineering';
import SkillsDisplay from '@/components/sections/SkillsDisplay';
import ContactSection from '@/components/sections/ContactSection';

// Dynamic import for below-the-fold interactive section (code splitting).
// Deferred to reduce initial JS bundle size (Req 15.3, 15.7).
const CareerStoryGenerator = dynamic(
  () => import('@/components/features/CareerStoryGenerator'),
  { ssr: false, loading: () => null }
);

/**
 * Home page — React Server Component composing all portfolio sections.
 * Each section component declares its own <section> with padding, id, and aria-label.
 * The parent layout provides <main id="main-content">.
 */
export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ImpactDashboard />
      <AboutSection />
      <TechnicalLeadership />
      <ArchitecturePrinciples />
      <ExperienceTimeline />
      <FeaturedProjects />
      <AIEngineering />
      <CareerStoryGenerator />
      <SkillsDisplay />
      <ContactSection />
    </div>
  );
}
