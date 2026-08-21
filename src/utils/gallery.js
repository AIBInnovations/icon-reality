/**
 * Turn a project's flat gallery array into categorised images.
 *
 * The category is read from the folder the image already sits in
 * (/images/oscar/park/park-1.jpg -> "Landscape"), because that grouping is the
 * client's own — it is how they delivered the photography. Nothing is guessed
 * from pixels: a path we don't recognise gets no category at all, and
 * ProjectGallery only shows its filter rail when two or more real categories
 * come back. A project whose images all sit in one folder therefore renders as
 * a plain grid rather than under a single meaningless tab.
 */
const FOLDER_LABELS = {
  entrance: 'Entrance',
  amenities: 'Amenities',
  park: 'Landscape',
  temple: 'Landmarks',
  construction: 'Construction',
  interior: 'Interior',
  exterior: 'Exterior',
  lifestyle: 'Lifestyle',
  location: 'Location',
};

export function categoriseGallery(gallery = [], projectName) {
  return gallery
    .map((entry) => (typeof entry === 'string' ? { src: entry } : entry))
    .filter((img) => img?.src)
    .map((img, i) => {
      if (img.category) return img;
      // second-to-last path segment: /images/<project>/<folder>/<file>
      const folder = img.src.split('/').slice(-2, -1)[0]?.toLowerCase();
      const category = FOLDER_LABELS[folder];
      return {
        ...img,
        ...(category ? { category } : {}),
        alt: img.alt || `${projectName || 'Project'}${category ? `: ${category.toLowerCase()}` : ''} image ${i + 1}`,
      };
    });
}
