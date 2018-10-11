import I18n, { getLanguages } from 'react-native-i18n';
import { localStorage } from '../services'
import { GlobalVals } from '../global'
import en from './locales/en'
import it from './locales/it'
import fr from './locales/fr'
import sp from './locales/sp'

I18n.fallbacks = true;


I18n.translations = {
  en,
  it,
  fr,
  sp
};

export default class Local
{
    constructor(props){
        
    }   

    static t(scope, option){
        if(option){
            option.locale = GlobalVals.language
        }else{
            option = {
                locale: GlobalVals.language
            }
        }
        translation = I18n.t(scope, option);
      
        return translation;
    }   
}