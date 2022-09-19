import {Product} from "./data";
import React, {AnimationEvent, MouseEvent, useRef, useState} from "react";
import invariant from "tiny-invariant";
import {Horizontal, Vertical} from "react-hook-components";
import {IoClose} from "react-icons/io5";
import {Stepper} from "antd-mobile";

const px = (v: any) => v + 'px';
const imageSize = {width: 100, height: 100};
const imageScale = 4;
const thumbScale = 0.7;
function CardThumb(props: { d: Product, visible: boolean }) {
    const {d, visible} = props;
    return <Vertical
        style={{opacity: visible ? 1 : 0, zIndex: visible ? 0 : -1, transition: 'opacity 300ms ease-in-out'}}>
        <img data-image-thumb={'true'} alt={d.name} src={`/images/${d.barcode}/THUMB/1.png`} width={imageSize.width}
             height={imageSize.height} style={{width: imageSize.width, height: imageSize.height}}/>
        <Vertical data-title={'true'}
                  style={{zIndex: 1, bottom: 0, width: imageSize.width, height: 60, overflow: 'hidden'}}>
            <Vertical style={{fontSize: '0.8rem'}}>
                {d.name}
            </Vertical>
            <Vertical style={{fontSize: '0.8rem'}}>
                <Vertical>
                    {d.unit} {d.unitType}
                </Vertical>
                <Vertical style={{color: 'dodgerblue', fontWeight: 'bold'}}>
                    {d.price} AED
                </Vertical>
            </Vertical>
        </Vertical>
    </Vertical>;
}

function CardDetail(props: { d: Product, visible: boolean }) {
    const {d, visible} = props;
    const containerRef = useRef<HTMLDivElement>(null);
    return <Vertical style={{
        position: 'absolute',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: visible ? 'flex' : 'none',
        opacity: visible ? 1 : 0,
        zIndex: visible ? 0 : -1,
        transition: 'opacity 300ms ease-in-out'
    }} top={-5} left={0} w={'100%'} h={'100%'} hAlign={'center'} vAlign={'center'}>
        <Vertical position={'absolute'} top={20} w={'100%'} p={10} style={{maxWidth: 400}}>
            <Vertical style={{fontSize: '2rem'}}>
                {d.name}
            </Vertical>
            <Horizontal style={{fontSize: '1.2rem',marginTop:10}}>
                {d.unit} {d.unitType}
                <Vertical style={{flexGrow: 1}}/>
                <Horizontal style={{color: 'dodgerblue', fontWeight: 'bold'}}>
                    {d.price} AED
                </Horizontal>
            </Horizontal>
        </Vertical>
        <Horizontal ref={containerRef} style={{
            overflow: 'auto',
            width: imageSize.width * imageScale,
            height: (imageSize.height * imageScale) + 50,
            scrollSnapType: 'x mandatory'
        }}>
            {Array.from({length: 4}).map((_, index) => {
                return <img key={index} alt={d.name} src={visible ? `/images/${d.barcode}/400/${index + 1}.png` : ''}
                            width={imageSize.width * imageScale}
                            height={imageSize.height * imageScale} style={{
                    width: imageSize.width * imageScale,
                    height: imageSize.height * imageScale,
                    scrollSnapAlign: "start",
                    marginBottom: 50
                }}/>
            })}
        </Horizontal>
        <Vertical style={{position: 'absolute', bottom: 0,paddingBottom:10}} hAlign={'center'}>

            <Horizontal >
                {Array.from({length: 4}).map((_, index) => {
                    return <img key={index} alt={d.name}
                                src={visible ? `/images/${d.barcode}/THUMB/${index + 1}.png` : ''}
                                width={imageSize.width * thumbScale}
                                height={imageSize.height * thumbScale} style={{width: imageSize.width * thumbScale, height: imageSize.height * thumbScale}}
                                onClick={() => {
                                    invariant(containerRef.current);
                                    containerRef.current.scrollTo({left: imageSize.width * imageScale * index});
                                }}/>
                })}
            </Horizontal>
            <Horizontal style={{maxWidth: 'calc(100% - 50px)', minWidth:350, width: '100%',paddingBottom:10,paddingTop:30,backgroundColor:'rgba(255,255,255,0.7)',borderRadius:5}} vAlign={'center'}>
                <Horizontal vAlign={'center'} style={{fontSize:'1.5rem'}}>
                    Add To Cart
                </Horizontal>
                <Vertical style={{flexGrow:1}}/>
                <Vertical mL={10} style={{backgroundColor:'#FFF',paddingRight:50}} >
                    <Stepper defaultValue={0} style={{transform:'scale(2)'}}/>
                </Vertical>
            </Horizontal>
        </Vertical>
    </Vertical>
}

export function ProductCard(props: { d: Product }) {
    const {d} = props;
    const [viewDetail, setViewDetail] = useState<boolean>(false);

    function onAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
        const element = (event.currentTarget as HTMLDivElement);
        const img: HTMLImageElement = element.querySelector('img') as any;
        const title: HTMLDivElement = element.querySelector('[data-title="true"]') as any;
        invariant(img);
        invariant(title);
        const animationProps: AnimationProps = JSON.parse(element.getAttribute('data-animation-props') ?? '');
        if (event.animationName === 'scale-up-animate') {
            element.classList.remove('scale-up');
            element.style.top = animationProps.end.top;
            element.style.left = animationProps.end.left;
            element.style.width = animationProps.end.width;
            element.style.height = animationProps.end.height;
            img.style.width = px(imageSize.width * imageScale);
            img.style.height = px(imageSize.height * imageScale);
            title.style.opacity = "0";
            setViewDetail(true);
        }
        if (event.animationName === 'scale-down-animate') {
            element.classList.remove('scale-down');
            element.style.top = "unset";
            element.style.left = "unset";
            element.style.width = "unset";
            element.style.height = "unset";
            element.style.zIndex = "0";
            element.style.position = 'relative';
            img.style.width = px(imageSize.width);
            img.style.height = px(imageSize.height);
            title.style.opacity = "1";
        }
    }

    function openDetail(event: MouseEvent<HTMLDivElement>) {
        const element = (event.currentTarget as HTMLDivElement);
        const {top, left, width, height} = element.getBoundingClientRect();
        const detailContainer = document.querySelector('.detail-container');
        invariant(detailContainer);
        const {
            top: nTop,
            left: nLeft,
            width: nWidth,
            height: nHeight
        } = detailContainer.getBoundingClientRect();
        const parentElement = element.parentElement;
        invariant(parentElement);
        const animationProps: AnimationProps = {
            start: {
                top: px(top),
                left: px(left),
                width: px(width),
                height: px(height)
            },
            end: {
                top: px(nTop),
                left: px(nLeft),
                width: px(nWidth),
                height: px(nHeight)
            }
        }
        element.parentElement.style.width = animationProps.start.width;
        element.parentElement.style.height = animationProps.start.height;
        element.style.top = animationProps.start.top;
        element.style.left = animationProps.start.left;
        element.style.width = animationProps.start.width;
        element.style.height = animationProps.start.height;
        element.style.zIndex = "10";
        element.style.position = 'fixed';
        const closeIcon: HTMLDivElement = element.querySelector('[data-closeicon]') as HTMLDivElement;
        closeIcon.style.display = 'flex';
        element.setAttribute('data-animation-props', JSON.stringify(animationProps));

        const css = generateCss(animationProps);
        const styleElement = document.querySelector('.dynamic-style');
        invariant(styleElement);
        styleElement.innerHTML = css;
        element.classList.add('scale-up');

        function onCloseDetail(e: any) {
            e.preventDefault();
            e.stopPropagation();
            setViewDetail(false);
            element.classList.add('scale-down');
            closeIcon.style.display = 'none';
        }

        return onCloseDetail;
    }

    return (<Vertical key={d.barcode} style={{flexShrink: 0}}>
        <Vertical backgroundColor={'#FFF'}
                  style={{borderRadius: 5, flexGrow: 1, zIndex: 0}}
                  onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.currentTarget.style.zIndex !== '0') {
                          console.log('We dont need again');
                          return;
                      }
                      const closeDetail = openDetail(e);
                      const closeIcon: HTMLDivElement = e.currentTarget.querySelector('[data-closeicon]') as HTMLDivElement;
                      closeIcon.onclick = closeDetail;
                  }}
                  onAnimationEnd={(e) => onAnimationEnd(e)}
        >
            <Vertical style={{position: 'relative', height: '100%'}} hAlign={'center'} vAlign={'center'}>
                <CardThumb d={d} visible={!viewDetail}/>
                <CardDetail d={d} visible={viewDetail}/>
                <Vertical
                    data-closeicon={'true'}
                    position={'absolute'}
                    top={0} right={0}
                    style={{display: 'none', color: 'dodgerblue', fontSize: '2rem'}}
                >
                    <IoClose/>
                </Vertical>
            </Vertical>

        </Vertical>
    </Vertical>);
}

interface AnimationProps {
    start: {
        top: string;
        left: string;
        width: string;
        height: string;
    },
    end: {
        top: string;
        left: string;
        width: string;
        height: string;
    }
}

function generateCss(animationProps: AnimationProps) {
    return `
        
.scale-up{
    animation-name: scale-up-animate;
    animation-timing-function: cubic-bezier(0,0,0.8,0.9);
    animation-duration: 300ms;
}

.scale-down{
    animation-name: scale-down-animate;
    animation-timing-function: cubic-bezier(0,0,0.8,0.9);
    animation-duration: 300ms;
}
.scale-up [data-title="true"]{
    opacity: 0 !important;
}
.scale-down [data-title="true"]{
    opacity: 0 !important;
}
.scale-up [data-image-thumb="true"]{
    animation-name: scale-up-img;
    animation-timing-function: cubic-bezier(0,0,0.8,0.9);
    animation-duration: 300ms;
}

.scale-down [data-image-thumb="true"]{
    animation-name: scale-down-img;
    animation-timing-function: cubic-bezier(0,0,0.8,0.9);
    animation-duration: 300ms;
}

@keyframes scale-up-img{
    0% {
        transform : scale(1);
    }
    100% {
        transform : scale(${imageScale});
    }
}

@keyframes scale-down-img{
    0% {
        transform : scale(1);
    }
    100% {
        transform : scale(${1 / imageScale});
    }
}

@keyframes scale-up-animate {
    0% {
        ${Object.keys(animationProps.start).map(key => `${key} : ${(animationProps.start as any)[key]};`).join('\n')}
    }
    100% {
        ${Object.keys(animationProps.end).map(key => `${key} : ${(animationProps.end as any)[key]};`).join('\n')}
    }
}
@keyframes scale-down-animate {
    0% {
        ${Object.keys(animationProps.end).map(key => `${key} : ${(animationProps.end as any)[key]};`).join('\n')}
    }
    100% {
        ${Object.keys(animationProps.start).map(key => `${key} : ${(animationProps.start as any)[key]};`).join('\n')}
    }
}
        `;
}

