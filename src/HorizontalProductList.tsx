import {Product} from "./data";
import React, {AnimationEvent, MouseEvent, useEffect, useRef} from "react";
import invariant from "tiny-invariant";
import {Horizontal, Vertical} from "react-hook-components";
import {IoClose} from "react-icons/io5";
import {imageSize} from "./App";

const px = (v: any) => v + 'px';

export function HorizontalProductList(props:{dp: Product[], category: string}) {
    const {dp, category} = props;

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

        const css = `
        
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
.scale-up img{
    animation-name: scale-up-img;
    animation-timing-function: cubic-bezier(0,0,0.8,0.9);
    animation-duration: 300ms;
}

.scale-down img{
    animation-name: scale-down-img;
    animation-timing-function: cubic-bezier(0,0,0.8,0.9);
    animation-duration: 300ms;
}

@keyframes scale-up-img{
    0% {
        transform : scale(1);
    }
    100% {
        transform : scale(4);
    }
}

@keyframes scale-down-img{
    0% {
        transform : scale(1);
    }
    100% {
        transform : scale(0.25);
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
        const styleElement = document.querySelector('.dynamic-style');
        invariant(styleElement);
        styleElement.innerHTML = css;
        element.classList.add('scale-up');

        function onCloseDetail(e: any) {
            e.preventDefault();
            e.stopPropagation();
            element.classList.add('scale-down');
            closeIcon.style.display = 'none';
        }

        return onCloseDetail;
    }

    function onAnimationEnd(event: AnimationEvent<HTMLDivElement>) {

        const element = (event.currentTarget as HTMLDivElement);
        const img:HTMLImageElement = element.querySelector('img') as any;
        invariant(img);
        const animationProps: AnimationProps = JSON.parse(element.getAttribute('data-animation-props') ?? '');
        if (event.animationName === 'scale-up-animate') {
            element.classList.remove('scale-up');
            element.style.top = animationProps.end.top;
            element.style.left = animationProps.end.left;
            element.style.width = animationProps.end.width;
            element.style.height = animationProps.end.height;

            img.style.width = px(imageSize.width * 4);
            img.style.height = px(imageSize.height * 4);
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
        }
    }

    const dpFiltered = dp.filter(d => d.category === category);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    function onScroll(){
        const scrollContainer = scrollContainerRef.current;
        invariant(scrollContainer);
        const {scrollLeft,offsetWidth,scrollWidth} = scrollContainer;
        const isMostLeft = scrollLeft <= 10;
        const isMostRight = (scrollLeft + offsetWidth) >= scrollWidth - 10 ;
        const leftShadow:HTMLElement = scrollContainer.nextElementSibling as any;
        invariant(leftShadow);
        const rightShadow:HTMLElement = leftShadow.nextElementSibling as any;
        leftShadow.style.opacity = isMostLeft ? '0' : '1';
        rightShadow.style.opacity = isMostRight ? '0' : '1';
    }
    useEffect(onScroll,[])

    return <Vertical style={{position: 'relative',overflow:'hidden'}}>
        <Horizontal ref={scrollContainerRef} style={{ position: 'relative', scrollSnapType: 'x mandatory', overflow: 'auto'}}
                    onScroll={onScroll}>
            {dpFiltered.map(d => {
                return (<Vertical key={d.barcode} style={{flexShrink: 0}}>
                    <Vertical backgroundColor={'#FFF'} p={5}
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
                            <img src={`/images/${d.barcode}/THUMB/default.jpg`} width={imageSize.width} height={imageSize.height}/>
                            <Vertical data-title={'true'} style={{zIndex: 1, bottom: 0, width: imageSize.width}}>
                                <Vertical style={{fontSize: '1rem'}}>
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
                                <Vertical
                                    data-closeicon={'true'}
                                    position={'absolute'}
                                    top={-5} right={-5}
                                    style={{display: 'none', color: 'dodgerblue', fontSize: '2rem'}}
                                >
                                    <IoClose></IoClose>
                                </Vertical>
                            </Vertical>
                        </Vertical>

                    </Vertical>
                </Vertical>)
            })}
        </Horizontal>
        <Vertical position={'absolute'} left={-20} top={0} h={'100%'} w={20} backgroundColor={'#FFF'}
                  style={{boxShadow: '7px 0px 10px -7px rgba(0,0,0,0.5)',opacity:0,transition:'opacity 100ms ease-in-out',borderRadius:0}}
        />
        <Vertical position={'absolute'} right={-20} top={0} h={'100%'} w={20} backgroundColor={'#FFF'}
                  style={{boxShadow: '-7px 0px 10px -7px rgba(0,0,0,0.5)',opacity:0,transition:'opacity 100ms ease-in-out',borderRadius:0}}
        />
    </Vertical>;
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