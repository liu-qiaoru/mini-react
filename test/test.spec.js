import { it, describe, expect } from 'vitest';
import React from '../core/react';

describe('createElement', () => {
    it("test createElement", () => {
        const el = React.createElement('div', null, 'hi')
    
        expect(el).toEqual({
            type: 'div',
            props: {
                children: [{
                    type: 'TEXT_ELEMENT',
                    props: {
                    nodeValue: 'hi',
                    children:[]
                        
                    }
                }]
            }
        })

    })
})