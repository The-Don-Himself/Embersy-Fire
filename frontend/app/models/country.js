import Model, { attr } from '@ember-data/model';

export default class CountryModel extends Model {
  @attr('string') name;
  @attr('string') iso2;
  @attr('string') iso3;
  @attr('string') currencycode;
  @attr('string') currencysymbol;
  @attr('string') callingcode;
  @attr('boolean') active;
}
