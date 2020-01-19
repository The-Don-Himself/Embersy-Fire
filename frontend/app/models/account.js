import Model, { attr, belongsTo } from '@ember-data/model';

export default class AccountModel extends Model {
  @attr('string') username;
  @attr('date', {
    defaultValue() { return new Date(); }
  }) joined;
  @attr('string') firstname;
  @attr('string') lastname;
  @attr('number', {
    defaultValue() { return 0; }
  }) avatarversion;
  @belongsTo('country', {
    async: false
  })
  country;
  @attr('string') bio;
  @attr('string') gender;
  @attr('date') birthday;
}
