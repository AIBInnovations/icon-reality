import SectionHeading from './SectionHeading';
import Milestones from './Milestones';
import './JourneySection.css';

// The company timeline on the home page, from the same company.js MILESTONES
// the About page lists.
export default function JourneySection() {
  return (
    <section className="journey" id="journey">
      <div className="container">
        <SectionHeading eyebrow="Our journey" title="A legacy built in milestones." />
        <Milestones />
      </div>
    </section>
  );
}
