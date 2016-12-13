/**
 * @dialog 弹出框组件
 * @module widget
 * @hujun 2014-09-20
 */

    


 $.widget( 'Dialog', {
        template: {
            close: '<a class="ui-dialog-close" title="关闭"></a>',
            mask: '<div class="ui-mask"></div>',
            title: '<div class="ui-dialog-title">'+
                        '<h3></h3>'+
                    '</div>',
            wrap: '<div class="ui-dialog">'+
                '<div class="ui-dialog-content"></div>'+
                '<div class="ui-dialog-btns">'+
                '</div>'+
                '</div> '
        },
        options: {
            /**
             * @property {Boolean} [autoOpen=true] 初始化后是否自动弹出
             * @namespace options
             */
            autoOpen: true,
            /**
             * @property {Array} [buttons=null] 弹出框上的按钮
             * @namespace options
             */
            buttons: null,
            /**
             * @property {Boolean} [closeBtn=true] 是否显示关闭按钮
             * @namespace options
             */
            closeBtn: true,
            /**
             * @property {Boolean} [mask=true] 是否有遮罩层
             * @namespace options
             */
            mask: true,
            /**
             * @property {Number} [width=300] 弹出框宽度
             * @namespace options
             */
            maskcolor: '#888',

            timeclose:true,

            /**
             * @property {Function} [timeout=3000] 当timeclose为true时，设置多久后自动关闭弹层
             * @namespace options
             */
            timeout: 3000,

            width: 300,
            /**
             * @property {Number|String} [height='auto'] 弹出框高度
             * @namespace options
             */
            height: 'auto',
            /**
             * @property {String} [title=null] 弹出框标题
             * @namespace options
             */
            title: null,
            /**
             * @property {String} [content=null] 弹出框内容
             * @namespace options
             */
            content: null,
            /**
             * @property {Boolean} [scrollMove=true] 是否禁用掉scroll，在弹出的时候
             * @namespace options
             */
            scrollMove: true,
            /**
             * @property {Element} [container=null] 弹出框容器
             * @namespace options
             */
            container: null,
            /**
             * @property {Function} [maskClick=null] 在遮罩上点击时触发的事件
             * @namespace options
             */
            maskClick: null,
            /**
             * @property {Function} [buttonClose=true] 点击按钮时默认关闭弹层，如不想关闭设为true
             * @namespace options
             */
            buttonClose: true,
        },
        _create: function(){
            var opts = this._options,me=this,
                $el = me.getEl();
            
            if( this._options.setup ){

                opts.content = opts.content ;

                opts.title = opts.title || this.$el.attr( 'title' );


            }
            me._initDom( $el );
            me._initEvent( $el );
            
            var browser = {

                versions: function () {

                    var u = navigator.userAgent, app = navigator.appVersion;
                    
                    return { //移动终端浏览器版本信息 
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器 
                        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器 
                        iPad: u.indexOf('iPad') > -1, //是否iPad 
                    };
                
                }(),
            
            }
            
            if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
              
                $('input,select,option').on('focus',function(){
                    $el.attr('ios','true');
                })
            
            }
            
        },
        _initDom:function( $el ){

            var me = this, opts = me._options, btns,
                i= 0, eventHanlder = $.proxy( me._eventHandler, me ),str='';
                btns= [];

                opts.buttons && $.each(opts.buttons, function( key ){
                    btns.push({
                        index: ++i,
                        text:key
                    });
                });

                btns && $.each(btns,function( key ){
                    str+='<a class="ui-btn ui-btn'+btns[key].index+'" data-key="'+btns[key].text+'">'+btns[key].text+'</a>';
                });
                //没有按钮时去掉按钮div,自动关闭弹层增加类名ui-dialog-autoclose selina 2014.12.19
                me.template.wrap='<div class="ui-dialog '+
                                    (opts.timeclose && !opts.closeBtn ? "ui-dialog-autoclose" : '' )+'">'+
                                    '<div class="ui-dialog-content"></div>'+
                                    (opts.buttons ? '<div class="ui-dialog-btns">'+str+'</div>' : '')+
                                    '</div>';                
        
        },
        _initEvent: function( $el ){

            var me = this, opts = me._options,
               eventHanlder = $.proxy( me._eventHandler, me );

                opts._container = $(opts.container || document.body);
                opts._mask = $( me.template.mask ).appendTo( opts._container ) ;
                opts._wrap = $(me.template.wrap).appendTo( opts._container );

                opts._title = $( me.template.title );
                opts._content = $( '.ui-dialog-content');
                opts._close = opts.closeBtn && $( me.template.close );
                me.title( opts.title );
                me.content( opts.content );
                // $('.ui-dialog-btns .ui-btn', opts._wrap).highlight('ui-state-hover');

                opts._wrap.css({width: opts.width,height: opts.height}); 
                //bind events绑定事件
                $(window).on( 'ortchange', eventHanlder);
                opts._wrap.on( 'click'+ me.eventNs , eventHanlder);
                opts._mask && opts._mask.on( 'click'+ me.eventNs , eventHanlder);
                opts.autoOpen && me.open();

        },
        _eventHandler: function( e ){
            
            var me = this, match, wrap, opts = me._options, fn;

            switch( e.type ){
                case 'ortchange':
                    this.refresh();
                    break;

                case 'touchmove':
                    opts.scrollMove && e.preventDefault();
                    break;

                case 'click':
                 
                    if(opts._mask && ($.contains(opts._mask[0], e.target) || opts._mask[0] === e.target )){

                        return me.trigger('maskClick');

                    }
                    //wrap = opts._wrap.get(0);
                    if( (match = $( e.target ).closest( '.ui-dialog-close')) && match.length ){
                        
                        me.close();
                        //if("undefined" != typeof vas)$(vas)['prependTo'](this.getEl());
                    } else if( (match = $( e.target ).closest( '.ui-dialog-btns .ui-btn' )) && match.length ) {
                        
                        
                        fn = opts.buttons[match.attr( 'data-key' )];

                        fn && fn.apply( me, arguments );
                        
                        opts.buttonClose && me.close();
                        //if("undefined" != typeof vas)$(vas)['prependTo'](this.getEl());
                        
                    }
            }
        },
         //背景和弹层位置
        _calculate: function(){

            var me = this, opts = me._options, size, $win,
                ret = {}, round = Math.round;
           
            if($('body').scrollTop()>0){
                opts.mask && (ret.mask = {

                    width: $( window ).width(),
                    height: $('body').height(),
                    background:opts.maskcolor
            
                });
            }else{
                opts.mask && (ret.mask = {

                    width: $( window ).width(),
                    height: $( window ).height(),
                    background:opts.maskcolor
            
                });
            }           
            size = opts._wrap.offset();
            $win = $('body');

            if($('body').scrollTop()>139 && this.$el.attr('ios')){
                ret.wrap = {
                
                    left: '50%',
                    marginLeft: -round(size.width/2) +'px',
                    top: $('body').scrollTop()+$( window ).height()/2-139,
                    marginTop: -round(size.height/2) +'px'

                };
            }else{
                ret.wrap = {
                
                    left: '50%',
                    marginLeft: -round(size.width/2) +'px',
                    top: $('body').scrollTop()+$( window ).height()/2,
                    marginTop: -round(size.height/2) +'px'

                };
            }

            if(opts.timeclose==true){
                setTimeout(function(){
                    me.close();
                },opts.timeout);
            };
            return ret;
        },

        /**
         * 用来更新弹出框位置和mask大小。如父容器大小发生变化时，可能弹出框位置不对，可以外部调用refresh来修正。
         * @method refresh
         * @return {self} 返回本身
         */
        refresh: function(){

            var me = this, opts = me._options, ret, action;
            if( opts._isOpen ) {

                action = function(){
                    ret = me._calculate();
                    ret.mask && opts._mask.css( ret.mask );
                    opts._wrap.css( ret.wrap );
               
                }

                //如果有键盘在，需要多加延时
                if( $.os.ios && document.activeElement && /input|textarea|select/i.test(document.activeElement.tagName)){
                    document.body.scrollLeft = 0;
                    setTimeout( action, 300 );//do it later in 200ms.

                } else {
                    action();//do it now
                }
            }
            return me;

        },

        /**
         * 弹出弹出框，如果设置了位置，内部会数值转给[position](widget/dialog.js#position)来处理。
         * @method open
         * @param {String|Number} [x] X轴位置
         * @param {String|Number} [y] Y轴位置
         * @return {self} 返回本身
         */
        open: function(x, y){

            var opts = this._options;
            opts._isOpen = true;

            opts._wrap.css({'display':'block','transform':'translateY(0px)'});
            opts._mask && opts._mask.css({'display':'block','transform':'translateY(0px)'});
            this.refresh();

            $(document).on( 'touchmove' , $.proxy(this._eventHandler, this));
            return this.trigger( 'open' );

        },

        /**
         * 关闭弹出框
         * @method close
         * @return {self} 返回本身
         */
        close: function(){
            
            var eventData, opts = this._options;
            this.destroy();

            if("undefined" != typeof vas){
                this.getEl().empty();
                $(vas)['prependTo'](this.getEl());
            };

            opts._isOpen = false;
            opts._wrap.css( 'display', 'none' );
            opts._mask && opts._mask.css( 'display', 'none' );
            $(document).off( 'touchmove' , this._eventHandler);
            return this.trigger( 'close' );
            
        },
        /**
         * 设置或者获取弹出框标题。value接受带html标签字符串
         * @method title
         * @param {String} [value] 弹出框标题
         * @return {self} 返回本身
         */
        title: function( value ) {

            var opts = this._options, setter = value !== undefined;

            if(setter){

                value = (opts.title = value) ? '<h3>'+value+'</h3>' : value;
                opts._title.html(value)[value?'prependTo':'remove'](opts._wrap);
                opts._close && opts._close.prependTo(opts.title? opts._title : opts._wrap);
            
            }
            return setter ? this : opts.title;
        },

        /**
         * 设置或者获取弹出框内容。value接受带html标签字符串和zepto对象。
         * @method content
         * @param {String|Element} [val] 弹出框内容
         * @return {self} 返回本身
         */
        content: function( val ) {

            var opts = this._options, setter = val!==undefined;
           // console.log(val);

            if(!val){
                vas = this.getEl().html()     
                val = vas;
                this.getEl().empty();
            }     

            setter && opts._content.empty().append(opts._content = val);
            return setter ? this: opts.content;
        
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         */
        destroy: function(){

            var opts = this._options, _eventHander = this._eventHandler;
            $(window).off( 'ortchange', _eventHander);
            $(document).off( 'touchmove', _eventHander);

            opts._wrap.off( 'click' , _eventHander).remove();
            opts._mask && opts._mask.off( 'click' , _eventHander).remove();
            // opts._close && opts._close.highlight();
            return this.$super( 'destroy' );
        
        }

    });
