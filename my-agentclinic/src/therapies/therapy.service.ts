import { Therapy } from './therapy.types';
import { ITherapyRepository } from './therapy.repository';
import { NotFoundError, ValidationError } from '../errors';

const VALID_CATEGORIES = ['cognitive', 'physical', 'relaxation', 'social', 'creative'];

export class TherapyService {
  constructor(private repo: ITherapyRepository) {}

  listTherapies(query: Record<string, string | undefined>): Therapy[] {
    let therapies = this.repo.findAll();

    const search = query['search']?.trim().toLowerCase();
    const therapist = query['therapist']?.trim().toLowerCase();
    const category = query['category']?.trim().toLowerCase();

    if (category) {
      if (!VALID_CATEGORIES.includes(category)) throw new ValidationError('Invalid category value');
      therapies = therapies.filter(t => t.category === category);
    }
    if (search) {
      therapies = therapies.filter(t => t.name.toLowerCase().includes(search));
    }
    if (therapist) {
      therapies = therapies.filter(t => t.therapist.toLowerCase().includes(therapist));
    }

    return therapies;
  }

  getTherapy(id: string): Therapy {
    const therapy = this.repo.findById(id);
    if (!therapy) throw new NotFoundError('Therapy not found');
    return therapy;
  }
}
