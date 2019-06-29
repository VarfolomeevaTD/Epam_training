// функция, преобразующая число в валюту
function numberToMoney(num) {
	// если функция получила пустую строку, ничего не происходит
	if (num === '')
		return '';
	
	// число передается в функцию уже в виде строки, в которой есть только точка
	var dot_index = num.indexOf('.');
	// если в функцию передано целое число, к нему приписываются нули
	if (dot_index == -1) {
		dot_index = num.length;
		num += ".00";
	}
	
	// число делится на целую и дробную части
	var num_parts = num.split('.');
	var int_part = num_parts[0];
	var frac_part = num_parts[1];
	// в массиве хранится только дробная часть
	num_parts = [ frac_part ];
	
	// целая часть числа разбивается на части по три цифры
	for (var i = int_part.length; i >= 0; i -= 3) {
		var end = i; var start = i - 3;
		// функция substring заменяет отрицательное
		// значение start на 0
		var digits = int_part.substring(start, end);
		
		// каждые три цифры записываются в массив num_parts
		if (digits !== '')
			num_parts[num_parts.length] = digits;
	}
	
	var money = "";
	// между полученными частями числа вставляются запятые
	for (var i = num_parts.length - 1; i > 1; i--)
		money += num_parts[i] + ',';
	// дописываются последние три цифры целой части и дробная часть
	money += num_parts[1];
	money += '.' + num_parts[0];
	
	// возвращается строка в виде валюты
	return "$" + money;
}

// функция, добавляющая в таблицу ряд
function addRow(name, count, price) {
	// поиск таблицы
	var table = document.getElementById("product-table");
	
	// вставляется новый ряд
	var row = table.insertRow();
	
	// вставляется ячейка с названием товара
	var cell = row.insertCell();
	cell.className = "left";
	cell.innerHTML = name;
	
	// вставляется ячейка с количеством
	cell = row.insertCell();
	cell.className = "right";
	cell.innerHTML = count;
	
	// вставляется ячейка с ценой
	cell = row.insertCell();
	cell.innerHTML = price;
	
	// вставляется ячейка с кнопками
	cell = row.insertCell();
	
	// в свойствах кнопок хранится номер строки, в которой они находятся
	var row_count = table.rows.length - 2;
	
	// создается кнопка Edit
	var btn = document.createElement("button");
	btn.className = "table-btn";
	btn.innerHTML = "Edit";
	btn.setAttribute("name", row_count);
	// задается функция, которая будет вызвана при нажатии
	btn.onclick = function() {
		// при нажатии на кнопку Edit кнопка Add становится Update
		var elem = document.getElementById("add-update-btn");
		elem.innerHTML = "Update";
		elem.value = this.name;
		
		// вызывается функция, которая заполняет поля внизу
		editProd(this.name);
	};
	// кнопка добавляется в ячейку
	cell.appendChild(btn);
	
	// создается кнопка Delete
	btn = document.createElement("button");
	btn.className = "table-btn";
	btn.innerHTML = "Delete";
	btn.setAttribute("name", row_count);
	btn.onclick = function() {
		// в окне confirm для кнопки Yes задается номер строки,
		// которую нужно удалить
		var yes_btn = document.getElementById("delete-confirm-yes");
		yes_btn.value = this.name;
		
		// вызывается окно confirm
		var dialog = document.getElementById("delete-confirm");
		dialog.show();
	}
	cell.appendChild(btn);
}

// функция, удаляющая ряд из таблицы
function removeRow(row_index) {
	// поиск таблицы
	var table = document.getElementById("product-table");
	// из таблицы удаляется строка
	table.deleteRow(row_index + 1);
	
	// для всех кнопок Edit и Delete задаются новые номера строк
	var table_btns = table.getElementsByClassName("table-btn");
	
	var index = 2 * row_index;
	for (var i = index, j = index; i < table_btns.length; i += 2, j++) {
		table_btns[i].setAttribute("name", j);
		table_btns[i + 1].setAttribute("name", j);
	}
}

// функция, очищающая таблицу
function clearTable() {
	var table = document.getElementById("product-table");
	for (var i = table.rows.length - 1; i > 0; i--)
		table.deleteRow(i);
}

// функция, которая ищет элемент в спике товаров,
// загружаемом из файла product_list.js
function indexSearchList(name, price) {
	var i = 0;
	var found = false;
	
	// функция ищет товар по названию и цене
	while(!found && i < product_list.length) {
		var list_name = product_list[i].name;
		var list_price = product_list[i].price;
		
		if (name == list_name && (price == 0 || price == list_price))
			found = true;
		else
			i++;
	}
	
	// если товар найден, функция вернет его индекс
	if (found)
		return i;
	
	// если товар не найден, функция вернет -1
	return -1;
}

// функция, которая ищет товар в таблице
function indexSearchTable(td, name, price) {	
	var i = 0;
	var found = false;
	
	// функция ищет товар по названию и цене
	while(!found && i < td.length) {
		var table_name = td[i].innerHTML;
		var table_price = td[i + 2].innerHTML;
		
		if (name == table_name && (price === '' || price == table_price))
			found = true;
		else
			i += 4;
	}
	
	// если товар найден, функция вернет номер строки
	if (found)
		return i;
	
	// если товар не найден, функция вернет -1
	return -1;
}

// функция, которая вызывается, когда поле для ввода цены теряет фокус
function priceOnBlur(num) {
	// функция получает цену в виде числа и преобразует его в валюту
	var money = numberToMoney(num.toString());
	
	// поле для ввода цены становится текстовым, и в него записывается валюта
	var elem = document.getElementById("price-input");
	elem.type = "text";
	elem.value = money;
}

// функция, которая вызывается, когда поле для ввода цены получает фокус
function priceOnFocus(elem) {
	// цена берется в виде валюты
	var money = elem.value;
	
	if (money !== '') {
		// из валюты удаляются запятые и знак $
		money = money.replace(/,/g, '').substr(1);
		// валюта преобразуется в число
		var num = Number.parseFloat(money);
		
		// поле для ввода цены становится числовым, и в него записывается цена
		elem.type = "number";
		elem.value = num;
	}
}

// функия, которая добавляет товар
function addProd() {
	/* если указать уже существующий товар, но с другой ценой,
	 * он будет добавлен как новый */
	
	// поиск нижних полей для ввода
	var bottom_input = document.getElementsByClassName('bottom-input');
	// название нового товара
	var new_name = bottom_input[0].value;
	// количество нового товара в виде строки и в виде числа
	var new_count_str = bottom_input[1].value;
	var new_count = Number.parseInt(new_count_str);
	// цена нового товара в виде валюты и в виде числа
	var new_price_money = bottom_input[2].value;
	// если цена не указана, в качестве числа берется 0
	var new_price = 0;
	if (new_price_money !== '')
		// валюта преобразуется в число
		new_price = Number.parseFloat(new_price_money.replace(/,/g, '').substr(1));
	
	// выполняется проверка на корректность
	var all_correct = true;
	
	// поиск элемента для вывода ошибок
	var err = document.getElementById("error");
	// предыдущие сообщения об ошибках удаляются
	clearErrors(err, bottom_input);
	
	// если название не указано или состоит из пробелов
	if (new_name.trim() == '') {
		var elem = document.createElement("span");
		elem.innerHTML = " Необходимо указать название товара <br>";
		
		err.appendChild(elem);
	}
	// если длина названия больше максимальной
	if (new_name.length > 15) {		
		var elem = document.createElement("span");
		elem.innerHTML = " Максимальная длина названия 15 символов <br>";
		
		err.appendChild(elem);
	}
	// вокруг поля для ввода названия появляется красная подсветка
	if (new_name.trim() == '' || new_name.length > 15) {
		all_correct = false;
		bottom_input[0].style.outline = "2px groove #FF0000";
	}
	
	// если не указано количество товара
	if (new_count_str == '') {
		var elem = document.createElement("span");
		elem.innerHTML = " Необходимо указать количество товара <br>";
		
		err.appendChild(elem);
	}
	// если указано отрицательное количество
	if (new_count < 0) {
		var elem = document.createElement("span");
		elem.innerHTML = " Количество не может быть отрицательным <br>";
		
		err.appendChild(elem);
	}
	// вокруг поля для ввода количества появляется красная подсветка
	if (new_count_str == '' || new_count < 0) {
		all_correct = false;
		bottom_input[1].style.outline = "2px groove #FF0000";
	}
	
	// если возникли ошибки, выводятся сообщения
	if (!all_correct) {
		err.style.visibility = "visible";
	}
	
	// если все верно
	if (all_correct) {
		// в списке товаров ищется введенный товар
		var index = indexSearchList(new_name, new_price);
		// если такого товара нет, в список и в конец таблицы добавляется новый товар
		if (index == -1) {
			var prod = {
				name: new_name,
				count: new_count,
				price: new_price
			}
			
			product_list[product_list.length] = prod;
			addRow(prod.name, prod.count, new_price_money);
		}
		// если введенный товар уже есть в списке
		else {
			// количество товара увеличивается
			product_list[index].count += new_count;	
			
			var table = document.getElementById("product-table");
			var td = table.getElementsByTagName("td");
			
			// ищется строка таблицы, содержащая этот товар
			var table_index = indexSearchTable(td, new_name, new_price_money);
			
			// изменяется запись в таблице
			var table_count = Number.parseFloat(td[table_index + 1].innerHTML);
			td[table_index + 1].innerHTML = table_count + new_count;
		}
	}
}

// функция, которая изменяет запись о товаре
// параметр функции - номер изменяемой строки
function updateProd(row_index) {
	// поиск нижних полей для ввода
	var bottom_input = document.getElementsByClassName('bottom-input');
	var name = bottom_input[0].value;
	var count = bottom_input[1].value;
	var price = bottom_input[2].value;
	
	// выполняется проверка на корректность
	var all_correct = true;
	// поиск элемента для вывода ошибок
	var err = document.getElementById("error");
	// удаляются предыдущие сообщения об ошибках
	clearErrors(err, bottom_input);
	
	// если название не указано или состоит из пробелов
	if (name.trim() == '') {
		var elem = document.createElement("span");
		elem.innerHTML = " Необходимо указать название товара <br>";
		
		err.appendChild(elem);
	}
	// если длина названия больше максимальной
	if (name.length > 15) {		
		var elem = document.createElement("span");
		elem.innerHTML = " Максимальная длина названия 15 символов <br>";
		
		err.appendChild(elem);
	}
	// поле для ввода названия подсвечивается красным
	if (name.trim() == '' || name.length > 15) {
		all_correct = false;
		bottom_input[0].style.outline = "2px groove #FF0000";
	}
	
	// если количество не указано
	if (count == '') {
		var elem = document.createElement("span");
		elem.innerHTML = " Необходимо указать количество товара <br>";
		
		err.appendChild(elem);
	}
	// если количесвто отрицательное
	if (count < 0) {
		var elem = document.createElement("span");
		elem.innerHTML = " Количество не может быть отрицательным <br>";
		
		err.appendChild(elem);
	}
	// поле для ввода количества подсвечивается красным
	if (count == '' || count < 0) {
		all_correct = false;
		bottom_input[1].style.outline = "2px groove #FF0000";
	}
	
	// если цена не указана
	if (price == '') {
		var elem = document.createElement("span");
		elem.innerHTML = " Необходимо указать цену <br>";
		
		err.appendChild(elem);
		
		all_correct = false;
		bottom_input[2].style.outline = "2px groove #FF0000";
	}
	
	// если возникли ошибки, выводятся сообщения
	if (!all_correct) {
		err.style.visibility = "visible";
	}
	
	// если все верно
	if (all_correct) {		
		var table = document.getElementById("product-table");
		var td = table.getElementsByTagName("td");
		
		// старая запись удаляется из таблицы, 
		// а новая добавляется в конец
		var index = Number.parseInt(row_index);
		removeRow(index);
		addRow(name, count, price);
		
		// кнопка Update теперь хранит номер последней строки,
		// поскольку обновляемой записи теперь соответствует последняя строка
		var btn = document.getElementById("add-update-btn");
		btn.value = table.rows.length - 2;
	}
}

// функция, удаляющая сообщения об ошибках
function clearErrors(err, bottom_input) {
	// удаляется текст сообщений
	err.innerHTML = "";
	// скрывается элемент, содержащий текст сообщений
	err.style.visibility = "hidden";
	// убирается красная подсветка полей
	for (var i = 0; i < bottom_input.length; i++)
		bottom_input[i].style.outline = "none";
}

// функция, вызываемая при нажатии кнопки Edit
// параметр функции - номер изменяемой строки
function editProd(row_index) {
	var table = document.getElementById("product-table");
	var td = table.getElementsByTagName("td");
	
	// получение данных из соответствующей строки
	var index = 4 * Number.parseInt(row_index);
	var name = td[index].innerHTML;
	var count = Number.parseInt(td[1 + index].innerHTML);
	var price = td[2 + index].innerHTML;
	
	var bottom_input = document.getElementsByClassName('bottom-input');
	
	// удаление сообщений об ошибках (если они были)
	var err = document.getElementById("error");
	clearErrors(err, bottom_input);
	
	// нижние поля заполняются данными о товаре
	bottom_input[0].value = name;
	bottom_input[1].value = count;
	bottom_input[2].value = price;
}

// функция, вызываемая при нажатии кнопки Add/Update
// параметр state - текст кнопки, val - номер строки для Update
function addUpdateProd(state, val) {
	// функция выбирает, добавлять или обновлять товар
	// в зависимости от состояния кнопки
	
	if (state == 'Add')
		addProd();
	if (state == 'Update')
		updateProd(val);
}

// функция, вызываемая при нажатии кнопки Add New
function addNewBtn() {
	var bottom_input = document.getElementsByClassName('bottom-input');
	
	// удаляются сообщения об ошибках (если они были)
	var err = document.getElementById("error");
	clearErrors(err, bottom_input);
	
	// поля для ввода очищаются
	for (var i = 0; i < bottom_input.length; i++)
		bottom_input[i].value = '';
	
	// кнопка переходит в состояние Add
	var btn = document.getElementById("add-update-btn");
	btn.innerHTML = "Add";
	btn.value = -1;
}

// функция, удаляющая товар
// в качестве параметра получает номер строки
function deleteProd(row_index) {	
	var index = Number.parseInt(row_index);
	
	var table = document.getElementById("product-table");
	var td = table.getElementsByTagName("td");
	
	// получения названия товара и его цены
	var name = td[4 * index].innerHTML;
	var price_money = td[2 + 4 * index].innerHTML;
	var price = Number.parseFloat(price_money.replace(/,/g, '').substr(1));
	
	// удаление строки таблицы
	removeRow(index);
	
	// удаление товара из списка
	index = indexSearchList(name, price);
	product_list.splice(index, 1);
}

// функция для закрытия окна confirm
function closeConfirmDialog() {
	var dialog = document.getElementById("delete-confirm");
	dialog.close();
}
// функция, вызываемая при нажатии Yes в окне confirm
function deleteConfirmYes(val) {
	deleteProd(Number.parseInt(val));
	closeConfirmDialog();
}

// функция для фильтрации
function searchProd() {
	// строка, введенная в поле для поиска, приводится к нижнему регистру
	var search_input = document.getElementById('search-input').value.toLowerCase();
	var table = document.getElementById("product-table");
	var names = table.getElementsByClassName('left');

	// если поле для поиска пусто, и в таблице присутствуют
	// все существующие товары, ничего не происходит
	
	// если поле для поиска пусто, но в таблице меньше строк, чем существует товаров,
	// то в таблице выводятся все товары
	if (search_input === '' && table.rows.length - 1 < product_list.length) {
		// таблица очищается
		clearTable();
		
		// выводятся все товары
		for (var i = 0; i < product_list.length; i++)
		{
			// получение очередного товара из списка
			var prod = product_list[i];
			// цена товара преобразуется в валюту
			var money = numberToMoney(prod.price.toString());
			// в таблицу добавляется строка
			addRow(prod.name, prod.count, money);
		}
	}
	// если поле для поиска не пусто
	if (search_input !== '') {
		// из таблицы удаляются ненужные строки
		for (var i = 0; i < names.length; i++) {
			var name = names[i].innerHTML.toLowerCase();
			var is_substr = name.indexOf(search_input);

			if (is_substr == -1)
			{
				removeRow(i);
				i--;
			}
		}
	}
}

// функция, выполняющая сортировку товаров
// в качестве параметров получает кнопку - иконку сортировки
function sortProd(sort_btn) {
	// по классу иконки определяется направление сортировки
	// (треугольник вниз или треугольник вверх)
	var asc = (sort_btn.className == "fa fa-sort-desc fa-lg");
	
	// положение треугольника меняется на противоположное
	if (asc)
		sort_btn.className = "fa fa-sort-asc fa-lg";
	else
		sort_btn.className = "fa fa-sort-desc fa-lg";

	var table = document.getElementById("product-table");
	var td = table.getElementsByTagName("td");
	
	// содержимое таблицы сохраняется в массив
	var content = [];
	for (var i = 0; i < td.length; i += 4) {
		var prod = {
			name: td[i].innerHTML,
			count: td[i + 1].innerHTML,
			price: td[i + 2].innerHTML
		}
		
		content[content.length] = prod;
	}
	
	// таблица очищается
	clearTable();
	
	// определяется, какая кнопка была нажата,
	// и выполняется сортировка по именам или по ценам
	if (sort_btn.id == "name-sort")
		sortNames(content, asc);
	
	if (sort_btn.id == "price-sort")
		sortPrices(content, asc);
}

// функция, выполняющая сортировку по именам
// параметр content - сортируемый массив, asc - порядок сортировки
function sortNames(content, asc) {
	// выполняется сортировка по именам
	content.sort(function(a, b) {
		if (a.name < b.name)
			return -1;
		if (a.name > b.name)
			return 1;
		
		return 0;
	});
	
	// таблица заполняется данными из массива
	// в зависимости от порядка сортировки, цикл идет
	// либо от начала к концу массива, либо от конца к началу
	if (asc) {
		for (var i = 0; i < content.length; i++)
			addRow(content[i].name, content[i].count, content[i].price);
	}
	else {
		for (var i = content.length - 1; i >= 0; i--)
			addRow(content[i].name, content[i].count, content[i].price);
	}
}

// функция, выполняющая сортировку по ценам
// параметр content - сортируемый массив, asc - порядок сортировки
function sortPrices(content, asc) {
	content.sort(function(a, b) {
		var a_price = Number.parseFloat(a.price.replace(/,/g, '').substr(1));
		var b_price = Number.parseFloat(b.price.replace(/,/g, '').substr(1));
		
		if (a_price < b_price)
			return -1;
		if (a_price > b_price)
			return 1;
		
		return 0;
	});
	
	if (asc) {
		for (var i = 0; i < content.length; i++)
			addRow(content[i].name, content[i].count, content[i].price);
	}
	else {
		for (var i = content.length - 1; i >= 0; i--)
			addRow(content[i].name, content[i].count, content[i].price);
	}
}