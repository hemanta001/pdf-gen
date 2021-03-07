import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AddIdCard} from './id-card.actions';
import {IdCardService} from '../id-card.service';
import {Injectable} from '@angular/core';
import {IdCard} from '../id-card.model';
import {tap} from 'rxjs/operators';

export class IdCardStateModel {
  savedIdCard: IdCard;
}

@State<IdCardStateModel>({
  name: 'idCards',
  defaults: {
    savedIdCard: null
  }
})
@Injectable()
export class IdCardState {
  constructor(private idCardService: IdCardService) {
  }

  @Selector()
  static getSavedIdCard(state: IdCardStateModel) {
    return state.savedIdCard;
  }

  @Action(AddIdCard)
  saveIdCard({patchState}: StateContext<IdCardStateModel>, {payload}: AddIdCard) {
    return this.idCardService.saveIdCard(payload).pipe(tap(savedIdCard => {
      patchState({
        savedIdCard: savedIdCard
      })
    }));
  }
}
