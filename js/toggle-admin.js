function ToggleAdmin() {
  this.body = document.querySelector('body');
  this.nodeId = drupalSettings.toggleAdmin && drupalSettings.toggleAdmin.nodeId;
  this.toggleLocalTasks = drupalSettings.toggleLocalTasks;
  this.enabledButtons = drupalSettings.toggleAdmin ? drupalSettings.toggleAdmin.enabledButtons : {};
  this.buttonContainer = document.createElement('div');
  this.clearCacheButton = document.querySelector('a[data-drupal-link-system-path="admin/flush"]');
  this.runCronButton = document.querySelector('a[data-drupal-link-system-path="run-cron"]');
  this.dragging = false;
  this.bottom = 20;
  this.right = 20;

  this.init = function() {
    this.buttonContainer.classList.add('admin-control-buttons-container');
    this.body.appendChild(this.buttonContainer);

    this.createButtons();
    this.addKeyboardListeners();
    this.addDragFunctionality();
  }

  this.createButtons = function() {
    var that = this;

    if (this.nodeId && this.enabledButtons.edit) {
      this.createButton(['edit-page'], ['fas', 'fa-pencil-alt'], 'Edit Page', 'Alt + E', '/node/' + that.nodeId + '/edit');
    }

    if (this.enabledButtons.clearCache) {
      this.createButton(['clear-cash'], ['fas', 'fa-trash'], 'Clear Cache', 'Alt + C', function() {
        that.clearCacheButton.click();
      });
    }

    if (this.enabledButtons.cron) {
      this.createButton(['run-cron'], ['fas', 'fa-clock'], 'Run CRON', 'Alt + R', function() {
        that.runCronButton.click();
      });
    }

    if (this.enabledButtons.logs) {
      this.createButton(['recent-logs'], ['far', 'fa-list-alt'], 'Recent Logs', 'Alt + L', '/admin/reports/dblog');
    }

    this.createButton(['admin-toggle'], ['fas', 'fa-bars'], 'Toggle Admin Menu', 'Alt + T', function() {
      that.toggleAdmin();
    });

    this.createButton(['settings'], ['fas', 'fa-cog'], 'Toggle Admin Settings', '', '/admin/config/user-interface/toggle-admin');
  }

  this.toggleAdmin = function() {
    this.body.classList.toggle('toggle-admin');
    
    if (this.toggleLocalTasks) {
      this.body.classList.toggle('toggle-local-tasks');
    }
  }

  this.addKeyboardListeners = function() {
    var that = this;
    document.addEventListener('keydown', function(e) {
      // Action on "alt + c"      
      if (e.keyCode === 67 && e.altKey && that.enabledButtons.clearCache) {
        that.clearCacheButton.click();
      }

      // Action on "alt + e"
      if (e.keyCode === 69 && e.altKey && that.nodeId && that.enabledButtons.edit) {
        window.location = '/node/' + that.nodeId + '/edit';
      }

      // Action on "alt + l"
      if (e.keyCode === 76 && e.altKey && that.enabledButtons.logs) {
        window.location = '/admin/reports/dblog';
      }

      // Action on "alt + r"
      if (e.keyCode === 82 && e.altKey && that.enabledButtons.cron) {
        that.runCronButton.click();
      }

      // Action on "alt + t"
      if (e.keyCode === 84 && e.altKey) {
        that.toggleAdmin();
      }
    });
  }

  this.createButton = function(classes, iconClasses, name, keyShortcut, onClick) {
    var that = this;
    var button = null;

    if (typeof(onClick) === 'function') {
      button = document.createElement('button');
      button.addEventListener('click', function() {
        if (that.dragging) {
          that.dragging = false;
        } else {
          onClick();
        }
      });
    } else {
      button = document.createElement('a');
      button.href = onClick;

      if (name === 'Recent Logs') {
        button.target = '_blank';
      }
    }
    
    button.classList.add('admin-control-button');
    button.name = name;
    button.setAttribute('aria-label', name);
    button.title = keyShortcut ? name + ' (' + keyShortcut + ')' : name;
    
    for (var i = 0; i < classes.length; i += 1) {
      button.classList.add(classes[i]);
    }

    var icon = document.createElement('i');
    for (var j = 0; j < iconClasses.length; j += 1) {
      icon.classList.add(iconClasses[j]);
    }

    button.appendChild(icon);
    this.buttonContainer.appendChild(button);
  }

  this.addDragFunctionality = function() {
    var that = this;
    let x = 0
    let y = 0;
    this.buttonContainer.addEventListener('mousemove', function(e) { 
      // Check if the left mouse button is down
      if (e.buttons === 1) {
        that.buttonContainer.classList.add('dragging');
        // Don't start the drag funcionality until it's been dragged 5 pixels
        // This helps prevent small accidental dragging
        if (x > 5 || y > 5 || x < -5 || y < -5) {
          that.dragging = true;
          that.bottom -= e.movementY;
          that.right -= e.movementX;
          that.buttonContainer.style.bottom = that.bottom + 'px';
          that.buttonContainer.style.right = that.right + 'px';
        } else {
          x -= e.movementX;
          y -= e.movementY;
        }
      }
    });

    this.buttonContainer.addEventListener('mouseup', function() {
      that.buttonContainer.classList.remove('dragging');
      x = 0;
      y = 0;
    });
  }
}


document.addEventListener('DOMContentLoaded', function() {
  var toggleAdmin = new ToggleAdmin();
  toggleAdmin.init();
});