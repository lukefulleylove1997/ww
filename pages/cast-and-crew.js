import React from 'react';
import Layout from '../hoc/Layout/Layout';
import * as actions from '../store/actions/general';
import axios from "../axios-site"
import CastView from "../containers/Movies/CastView"
import CastBrowse from "../containers/Movies/Cast"
import i18n from '../i18n';
import { withTranslation } from 'react-i18next';
import PageNotFound from "../containers/Error/PageNotFound"
import PermissionError from "../containers/Error/PermissionError"
import Login from "../containers/Login/Index"
import Maintanance from "../containers/Error/Maintenance"

const Cast = (props) => (
  <Layout {...props} artistView={true} >
    {
      props.pagenotfound ? 
        <PageNotFound {...props} />
        : props.user_login ?
        <Login {...props} />
        :  props.permission_error ?
        <PermissionError {...props} />
        : props.maintanance ?
        <Maintanance {...props} />
        :
        props.pageData.castncrewId ? 
        <CastView {...props} />
        :
        <CastBrowse {...props} />
    }
  </Layout>
)

const Extended = withTranslation('common', { i18n, wait: process.browser })(Cast);

Extended.getInitialProps = async function(context) {
    const isServer = !!context.req
    if(isServer){
        const req = context.req
        req.i18n.toJSON = () => null
        const initialI18nStore = {}
        req.i18n.languages.forEach((l) => {
            initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
        })
        await context.store.dispatch(actions.setPageInfoData(context.query))
        return {pageData:context.query,initialI18nStore,i18n: req.i18n,initialLanguage: req.i18n.language}
    }else{
      let id = context.query.castncrewId ? "/"+context.query.castncrewId : ""
      const pageData = await axios.get("/cast-and-crew"+id+"?data=1");
      return {pageData:pageData.data.data,user_login:pageData.data.user_login,pagenotfound:pageData.data.pagenotfound,permission_error:pageData.data.permission_error,maintanance:pageData.data.maintanance}
   }
}

export default Extended