import {Product} from "./data";
import React, {useEffect, useRef} from "react";
import invariant from "tiny-invariant";
import {Horizontal, Vertical} from "react-hook-components";
import {ProductCard} from "./ProductCard";
import {db, LineItem} from "./db";
import {useObserver} from "react-hook-useobserver";



export function HorizontalProductList(props: { dp: Product[], category: string,onValueChange:() => void }) {
    const {dp, category,onValueChange} = props;

    const dpFiltered = dp.filter(d => d.category === category);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    function onScroll() {
        const scrollContainer = scrollContainerRef.current;
        invariant(scrollContainer);
        const {scrollLeft, offsetWidth, scrollWidth} = scrollContainer;
        const isMostLeft = scrollLeft <= 10;
        const isMostRight = (scrollLeft + offsetWidth) >= scrollWidth - 10;
        const leftShadow: HTMLElement = scrollContainer.nextElementSibling as any;
        invariant(leftShadow);
        const rightShadow: HTMLElement = leftShadow.nextElementSibling as any;
        leftShadow.style.opacity = isMostLeft ? '0' : '1';
        rightShadow.style.opacity = isMostRight ? '0' : '1';
    }

    useEffect(onScroll, [])

    return <Vertical style={{position: 'relative', overflow: 'hidden'}}>
        <Horizontal ref={scrollContainerRef}
                    style={{position: 'relative', scrollSnapType: 'x mandatory', overflow: 'auto'}}
                    onScroll={onScroll}>
            {dpFiltered.map(d => {
                return <ProductCard d={d} key={d.barcode} onValueChange={onValueChange}/>
            })}
        </Horizontal>
        <Vertical position={'absolute'} left={-20} top={0} h={'100%'} w={20} backgroundColor={'#FFF'}
                  style={{
                      boxShadow: '0px 0px 10px -1px rgba(0,0,0,0.9)',
                      opacity: 0,
                      transition: 'opacity 100ms ease-in-out',
                      borderRadius: 0
                  }}
        />
        <Vertical position={'absolute'} right={-20} top={0} h={'100%'} w={20} backgroundColor={'#FFF'}
                  style={{
                      boxShadow: '0px 0px 10px -1px rgba(0,0,0,0.9)',
                      opacity: 0,
                      transition: 'opacity 100ms ease-in-out',
                      borderRadius: 0
                  }}
        />
    </Vertical>;
}

