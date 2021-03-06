import React from "react"
import { connect } from "react-redux";
import Carousel from "react-slick"
import Link from "../../components/Link"
import CensorWord from "../CensoredWords/Index"

class Slideshow extends React.Component {
    constructor(props) {
        super(props)
        let propsData = {...props}
        this.state = {
            slides: props.slides,
            id: 1,
            language:propsData.i18n.language
        }
        this.slider = null
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(typeof window == "undefined" || nextProps.i18n.language != $("html").attr("lang")){
            return null;
        }
        if(prevState.localUpdate){
            return {...prevState,localUpdate:false}
        }else if(nextProps.slides != prevState.slides || nextProps.i18n.language != prevState.language){
            return {slides:nextProps.slides,language:nextProps.i18n.language}
        } else{
            return null
        }
    }
  
    getItemIndex(item_id) {
        if (this.state.slides) {
            const items = [...this.state.slides];
            const itemIndex = items.findIndex(p => p.movie_id == item_id);
            return itemIndex;
        } else {
            return -1;
        }
    }
    linkify(inputText) {
        inputText = inputText.replace(/&lt;br\/&gt;/g, ' <br/>')
        inputText = inputText.replace(/&lt;br \/&gt;/g, ' <br/>')
        inputText = inputText.replace(/&lt;br&gt;/g, ' <br/>')
        var replacedText, replacePattern1, replacePattern2, replacePattern3;
    
        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" rel="nofollow">$1</a>');
    
        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" rel="nofollow">$2</a>');
    
        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" rel="nofollow">$1</a>');
    
        return replacedText;
    }
    render() {
        if (!this.state.slides || !this.state.slides.length) {
            return null
        }
        
        const Right = props => (
            <button className="control-arrow control-next" onClick={props.onClick}>
              <span className="material-icons" data-icon="keyboard_arrow_right"></span>
            </button>
          )
        const Left = props => (
            <button className="control-arrow control-prev" onClick={props.onClick}>
              <span className="material-icons" data-icon="keyboard_arrow_left"></span>
            </button>
          )
        var settings = {
            dots: true,
            autoplay:true,
            autoplaySpeed:3000,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            className:"carousel-slider",
            initialSlide: 0,
            nextArrow:<Right />,
            prevArrow:<Left />,
            centerMode: true,
            centerPadding: '4%'
          };
        return (
            
            <div className={`SlideAdsWrap  nobtn`}>
                <div id="snglFullWdth" className="snglFullWdth">
                <Carousel {...settings} >
                {
                   this.state.slides.map(item => {
                    
                        let isS3 = true
                        let background  = ""
                        let avtar = ""
                        if (item.image) {
                            const splitVal = item.image.split('/')
                            if (splitVal[0] == "http:" || splitVal[0] == "https:") {
                                isS3 = false
                            }
                        }
                        background = (isS3 ? this.props.pageInfoData.imageSuffix : "") + item.image
                        let isS3Avtar = true
                        if (item.avtar) {
                            const splitVal = item.avtar.split('/')
                            if (splitVal[0] == "http:" || splitVal[0] == "https:") {
                                isS3Avtar = false
                            }
                        }
                        avtar = (isS3Avtar ? this.props.pageInfoData.imageSuffix : "") + item.avtar
                        return(
                            
                            <div className="banner-wrap justify-content-between align-items-center" key={item.movie_id}>
                                <div className="left-wrap">
                                    <h4 className="my-3 ellipsize2Line">
                                        <Link href="/watch" customParam={`videoId=${item.custom_url}`} as={`/watch/${item.custom_url}`}>
                                            <a>{<CensorWord {...this.props} text={item.title} />}</a>
                                        </Link>
                                    </h4>
                                    <div className="BnrUserInfo mb-3 description" style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{__html:this.linkify(item.description)}}>
                                        
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Link href="/watch" customParam={`videoId=${item.custom_url}`} as={`/watch/${item.custom_url}`}>
                                            <a className="btn btn-lg playBtn">
                                                <span className="d-flex align-items-center justify-content-center">
                                                    <span className="material-icons-outlined">
                                                        play_arrow
                                                    </span> {this.props.t("Watch Now")}
                                                </span>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                                <div className="right-wrap" style={{ backgroundImage: `url(${background})` }}></div>
                            </div>
                        )
                    })
                }
               </Carousel>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        menuOpen:state.search.menuOpen,
        pageInfoData: state.general.pageInfoData
    };
};

export default connect(mapStateToProps, null, null)(Slideshow)