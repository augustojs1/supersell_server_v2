import * as slugify from 'slugify';

export class SlugProvider {
  public slugify(payload: string): string {
    return slugify.default(payload, {
      trim: true,
      lower: true,
    });
  }
}
