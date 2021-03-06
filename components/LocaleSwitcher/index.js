import React from 'react';
import { withNamespaces, i18n } from '../../i18n';
import axios from "../../axios-orders"

class LocaleSwitcher extends React.Component {
  changeLanguage(code,is_rtl,e) {
    e.preventDefault()
    $('html').attr('dir',is_rtl ? "rtl" : "ltr");
    //setTimeout(() => {
      $('html').attr('lang',code);
    //}, 1000);
    let CDN_URL_FOR_STATIC_RESOURCES = this.props.pageInfoData.CDN_URL_FOR_STATIC_RESOURCES ? this.props.pageInfoData.CDN_URL_FOR_STATIC_RESOURCES : ""
    if(is_rtl){
      let RTLlink = `<link id="bootstrap-link-rtl" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.rtl.min.css" rel="stylesheet" />`;
      $(RTLlink).insertAfter("#bootstrap-link");
      let link = `<link id="custom-rtl-link" href="${CDN_URL_FOR_STATIC_RESOURCES}/static/css/rtl.style.css" rel="stylesheet" />`;
      $(link).insertAfter("#custom-responsive-link");
    }else{
      $("#custom-rtl-link").remove();
      $("#bootstrap-link-rtl").remove();
      $("#bootstrap-link").attr("href",'https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css');
    }
    i18n.changeLanguage(code)
    const formData = new FormData()
    formData.append('code', code)            
    let url = '/members/language'
    axios.post(url, formData)
        .then(response => {
          
        })
  }
  getSelectedLanguage(){
    let language =  this.props.pageInfoData.languages.find((elem) => {
      return i18n.language == elem.code
    })
    return language ? language : ""
  }
  render() {
    if (!this.props.pageInfoData.languages || this.props.pageInfoData.languages.length < 2) {
      return null
    }
    const { t } = this.props;
    return (
      <li className="nav-item dropdown">
        <a className="nav-link" href="#" id="navbarDropdown"
          role="button" data-bs-toggle="dropdown" aria-haspopup="true"
          aria-expanded="false">
          <span className={`flag-icon ${this.getSelectedLanguage().class}`}> </span>  {t(this.getSelectedLanguage().title)}
          </a>
        <ul className="dropdown-menu dropdown-menu-right languageListWrap" aria-labelledby="navbarDropdown">
          {
            this.props.pageInfoData.languages.map(language => {
              return (
                <li key={language['code']}>
                  <a className="dropdown-item languageList" href="#" onClick={this.changeLanguage.bind(this,language.code,language.is_rtl)}><span className={`flag-icon ${language.class}`}> </span>  {t(`${language.title}`)}</a>
                </li>
              )
            })
          }
        </ul>
      </li>
    );
  }
}

export default withNamespaces(['common'])(LocaleSwitcher);