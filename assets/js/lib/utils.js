import kefir from 'kefir';
import _ from 'lodash';
import Q from 'q';

export function loadingAjax(url, data, method='POST') {
  return kefir.repeat(i => {
    if (i === 0) {
      return kefir.constant({loading:true});
    } else if (i === 1) {
      return ajax(url, data, method).map(x => {
        x.loading = false;
        return x;
      });
    } else {
      return false;
    }
  });
};

export function ajax(url, data, method='POST') {
  let params = {
    method: method,
    // data: _.isString(data) ? data : JSON.stringify(data),
    dataType: 'json',
    url: url,
    contentType: 'application/json; charset=UTF-8'
  };

  if (data) {
    if (_.isString(data)) {
      params.data = data;
    } else {
      params.data = JSON.stringify(data);
    }
  }

  let promise = Q($.ajax(params));

  let ajaxPromise = kefir.fromPromise(promise);

  ajaxPromise.log('ajax');

  ajaxPromise.mapErrors(function(resp) {
    return resp.responseJSON;
  })
    .onError(function(error) {
      let alert_bar = $('.major-alert'),
        alert_text = alert_bar.find('h3');
      if (error === undefined) {
        alert_text.text('Server Error');
        alert_bar.addClass('show-major-alert');
        setTimeout(function() {
          alert_bar.removeClass('show-major-alert');
        }, 5000);
      } else {
        //error = JSON.parse(error);
        //alert_text.text(error.non_field_errors[0]);
        alert_bar.addClass('show-major-alert');
        setTimeout(function() {
          alert_bar.removeClass('show-major-alert');
        }, 5000);
      }
    });

  return ajaxPromise;
}


export function transform(initValue, ...args) {
  let mutations = [];
  while (args.length) {
    let [source, calculateNewValue, ...newArgs] = args;
    mutations.push(source.map(e => ({event: e, mutation: calculateNewValue})));
    args = newArgs;
  }

  return kefir.merge(mutations)
    .scan((prev, { event, mutation }) => mutation(prev, event), initValue);
}

export function csrf_token() {
  return (function getCookie(name){
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  })('csrftoken');
};