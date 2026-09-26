import SectionHeading from './SectionHeading';
import VisionMission from './VisionMission';
import './PurposeSection.css';

// Vision, mission and values on the home page: the same component and the same
// company.js copy as the About page, so the two can never state different ones.
export default function PurposeSection() {
  return (
    <section className="purpose" id="purpose">
      <div className="container">
        <SectionHeading eyebrow="Our purpose" title="Vision & mission." />
        <VisionMission />
      </div>
    </section>
  );
}
