
const RenderComponent = require('../components/CCRenderComponent');
const BlendFactor = require('../platform/CCMacro').BlendFactor;
const gfx = require('../../renderer/gfx');

/**
 * !#en
 * Helper class for setting material blend function.
 * !#zh
 * 设置材质混合模式的辅助类。
 * @class BlendFunc
 */
let BlendFunc = cc.Class({
    properties: {
        _srcBlendFactor: BlendFactor.SRC_ALPHA,
        _dstBlendFactor: BlendFactor.ONE_MINUS_SRC_ALPHA,

        /**
         * !#en specify the source Blend Factor, this will generate a custom material object, please pay attention to the memory cost.
         * !#zh 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的开销
         * @property srcBlendFactor
         * @type {macro.BlendFactor}
         * @example
         * sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
         */
        srcBlendFactor: {
            get () {
                return this._srcBlendFactor;
            },
            set (value) {
                if (this._srcBlendFactor === value) return;
                this._srcBlendFactor = value;
                this._updateBlendFunc(true);
                this._onBlendChanged && this._onBlendChanged();
            },
            animatable: false,
            type: BlendFactor,
            tooltip: CC_DEV && 'i18n:COMPONENT.sprite.src_blend_factor',
            visible: true
        },

        /**
         * !#en specify the destination Blend Factor.
         * !#zh 指定目标的混合模式
         * @property dstBlendFactor
         * @type {macro.BlendFactor}
         * @example
         * sprite.dstBlendFactor = cc.macro.BlendFactor.ONE;
         */
        dstBlendFactor: {
            get () {
                return this._dstBlendFactor;
            },
            set (value) {
                if (this._dstBlendFactor === value) return;
                this._dstBlendFactor = value;
                this._updateBlendFunc(true);
            },
            animatable: false,
            type: BlendFactor,
            tooltip: CC_DEV && 'i18n:COMPONENT.sprite.dst_blend_factor',
            visible: true
        },
    },

    setMaterial (index, material) {

        this._getNewBlendFactor()   //add kennys

        let materialVar = RenderComponent.prototype.setMaterial.call(this, index, material);

        if (this._srcBlendFactor !== BlendFactor.SRC_ALPHA || this._dstBlendFactor !== BlendFactor.ONE_MINUS_SRC_ALPHA) {
            this._updateMaterialBlendFunc(materialVar);
        }

        return materialVar;
    },

    _updateMaterial () {
        this._updateBlendFunc();
    },

    _updateBlendFunc (force) {

        this._getNewBlendFactor()   //add kennys

        if (!force) {
            if (this._srcBlendFactor === BlendFactor.SRC_ALPHA && this._dstBlendFactor === BlendFactor.ONE_MINUS_SRC_ALPHA) {
                return;
            }
        }
        
        let materials = this.getMaterials();
        for (let i = 0; i < materials.length; i++) {
            let material = materials[i];
            this._updateMaterialBlendFunc(material);
        }
    },

    _updateMaterialBlendFunc (material) {

        this._getNewBlendFactor()   //add kennys

        material.setBlend(
            true,
            gfx.BLEND_FUNC_ADD,
            this._srcBlendFactor, this._dstBlendFactor,
            gfx.BLEND_FUNC_ADD,
            this._srcBlendFactor, this._dstBlendFactor
        );
        
        if (CC_JSB) {
            RenderComponent.prototype.markForRender.call(this, true);
        }        
    },

    //add kennys
    _getNewBlendFactor() {

        // if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        //     return
        // }
        
        return;

        //如果贴图使用了预乘，则将源改为one
        if (this && this.spriteFrame && this.spriteFrame.getTexture() && this.spriteFrame.getTexture()._premultiplyAlpha && this._srcBlendFactor != BlendFactor.ONE) {
            
            if (this.node.name != "NO_Need_Blend") {
                // console.log("替换 src1")
                this._srcBlendFactor = BlendFactor.ONE
            } else {
                // console.log("NO_Need")
            }

        } else if (this.fontSize && this.cacheMode != 2 && !CC_NATIVERENDERER && this._srcBlendFactor != BlendFactor.ONE) {  //如果是系统文字，则变为one

            //debug的文字因为手动改了cachemode 为2 因此需要特殊处理下
            if (this.node.name == "LEFT-PANEL" || this.node.name == "RIGHT-PANEL") {
                return;
            }

            // console.log("替换 src2 ",this.name)
            this._srcBlendFactor = BlendFactor.ONE
            this._ttfTexture && this._ttfTexture.setPremultiplyAlpha(true);
            this._letterTexture && this._letterTexture.setPremultiplyAlpha(true);
        }
    }
    
});

module.exports = cc.BlendFunc = BlendFunc;
