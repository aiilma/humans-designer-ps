function init_templates_window()
{
    /*ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ*/
    var DIR_TEMPLATES = Folder ("/e/dir_hd_templates/"); // путь директории шаблонов
    
    
    // получение имени шаблона/файла
    function toGetTemplateNames(paths)
    {
        var mask_file_names = []; 
        for (var i = 0; i < paths.length; i++)
        {
            var full_filename = String(paths[i]).substr(20);
            var filename = full_filename.substr(0, full_filename.length-4);
            mask_file_names.push(filename);
        }
        return mask_file_names;
    }
    // получение списка объектов, где каждый объект - полная директория до шаблона
    function toGetTemplateDirs(infiles /**/)
    {
        var mask_dir_names = [];
        for (var i = 0; i < infiles.length; i++)
        {
          mask_dir_names.push(infiles[i]);
        }
        return mask_dir_names;
    }

    // конвертировать слои в смарт-объект (для сохранения прозрачности при выделении)
    function layconv_smart()
    {
        doAction("layerToSmart", "Admin");
    }

    // импорт выбранного файла в текущий документ
    function apply_TplToDoc()
    {
        try{
            optional_filename = File(DIR_TEMPLATES + "/" + elem_tpl_list.selection.text + ".psd");
            app.open(optional_filename);
            layconv_smart(); // выделение всех слоёв и преобразование в смарт-объект во избежание потери прозрачности
            app.activeDocument.selection.selectAll();
            app.activeDocument.selection.copy();
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            app.activeDocument.paste();
        } catch(e) {
            if(e instanceof TypeError)
            {
                alert("Вероятно, вы не выбрали элемент из списка.");
            } else 
            {
                alert(e.message);
             }
            return false;
        }
    
        elem_mainW.close();
        return true;
    }

    var elem_mainW = new Window ("dialog", "Human Designer");
    /*ГРУППЫ И ПАНЕЛИ*/
    var elem_mainW_panel_tle = elem_mainW.add("panel");
    var elem_mainW_group_tle = elem_mainW.add("group");
    elem_mainW_panel_tle.add('statictext', undefined, "Листинг шаблонов:");
    /*ЛИСТИНГ*/
    var template_dirs = toGetTemplateDirs(DIR_TEMPLATES.getFiles ("*.psd"));
    var elem_tpl_list = elem_mainW_panel_tle.add ("listbox", [0,0,140,100]);
    for (var i = 0; i < template_dirs.length; i++)
    { // инициализация списка значениями
        elem_tpl_list.add("item", toGetTemplateNames(template_dirs)[i], template_dirs.length);
     }
    /*КНОПКИ*/
    var btn_addTplToDoc = elem_mainW_group_tle.add("button", undefined, "Применить");
    var btn_exit = elem_mainW_group_tle.add("button", undefined, "Выход", {name: "ok"});
    /*ОБРАБОТЧИКИ*/
    btn_addTplToDoc.addEventListener("click", apply_TplToDoc);
    
    
    elem_mainW.show();
 }



init_templates_window();