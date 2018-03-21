/**
 * contextMenu v2.2.2
 * @author Yuri2(yuri2peter@qq.com)
 * @link https://github.com/yuri2peter/contextMenu
 * Enjoy! (●'◡'●)
 * 基于jq的右键菜单（动态绑定）
 * @author Yuri2
 */
window.ContextMenu={
    _className:'yuri2-context-menu',
    _stopProp:function (e) {
        if (e.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }
        e.stopImmediatePropagation();
        e.stopPropagation();
    },
    render:function (e, menu, trigger,theme) {
        theme||(theme='');
        var x=e.clientX,y=e.clientY;
        this._stopProp(e);
        this._removeContextMenu();
        if(menu===true){return;}
        if(typeof menu === 'object' && menu.length===0){menu=[['...']]}
        var dom = $("<div class='"+ContextMenu._className+" "+theme+"'><ul></ul></div>");
        $('body').append(dom);
        var ul=dom.find('ul');
        if(x+150>document.body.clientWidth){x-=150;ul.addClass('left')}
        menu.forEach(function (item) {
            if(item==='|'){
                ul.append($('<hr/>'));
            }
            else if(typeof(item)==='string'){
                ul.append($('<li><div class="title">'+item+'</div></li>'));
            }
            else if(typeof(item)==='object'){
                var sub=$('<li><div class="title '+(item[2]===true?'disable':'')+'">'+item[0]+'</div></li>');
                ul.append(sub);
                if(typeof(item[1])==='object'){
                    var subMenu=$("<div class='sub "+ContextMenu._className+" "+theme+"'><ul></ul></div>");
                    sub.addClass('sub');
                    if(x+300>document.body.clientWidth){subMenu.addClass('left')}
                    sub.append(subMenu);
                    item[1].forEach(function (t) {
                        if(t==='|'){
                            subMenu.append($('<hr/>'));
                        }
                        else if(typeof(t)==='string'){
                            subMenu.append($('<li><div class="title">'+t+'</div></li>'));
                        }
                        else if(typeof(t)==='object'){
                            var subLi=$('<li><div class="title '+(t[2]===true?'disable':'')+'">'+t[0]+'</div></li>');
                            subMenu.append(subLi);
                            if(t[2]!==true){
                                subLi.click(trigger,t[1]);
                                subLi.click(function () {ContextMenu._removeContextMenu();});
                            }
                        }
                    })
                }
                else if(typeof(item[1])==='function' &&item[2]!==true){
                    sub.click(trigger,item[1]);
                    sub.click(function () {ContextMenu._removeContextMenu();});
                }
            }
        });
        //修正坐标
        if(y+dom.height()>document.body.clientHeight && document.body.clientHeight>0){y-=dom.height()}
        dom.css({
            top:y,
            left:x,
        });
    },
    _removeContextMenu:function () {
        $('.'+ContextMenu._className).remove();
    },
};

$(document).click(function (e) {
    if ($(e.target).hasClass(ContextMenu._className) || $(e.target).parents('.'+ContextMenu._className).length > 0) return;
    ContextMenu._removeContextMenu();
});