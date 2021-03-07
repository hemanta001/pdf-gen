import {IdCard} from '../id-card.model';

export class AddIdCard{
  static readonly type ='[IdCard] add';
  constructor(public payload: IdCard) {
  }
}
