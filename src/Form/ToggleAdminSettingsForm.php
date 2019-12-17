<?php

namespace Drupal\toggle_admin\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class ToggleAdminSettingsForm extends ConfigFormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'toggle_admin_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function getEditableConfigNames() {
    return ['toggle_admin.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('toggle_admin.settings');

    $form['toggle_enabled'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Enable Toggle Controls'),
      '#description' => $this->t('This enables or disables the module functionality.'),
      '#default_value' => $config->get('toggle_enabled') ?: FALSE,
    );

    $form['toggle_local_tasks'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Toggle Local Tasks'),
      '#description' => $this->t('Toggle local tasks toolbar when toggling the admin menu.'),
      '#default_value' => $config->get('toggle_local_tasks') ?: FALSE,
    );

    $form['default_on'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Show Admin Menu By Default'),
      '#description' => $this->t('Should the admin menu be shown by default on initial page load.'),
      '#default_value' => $config->get('default_on') ?: FALSE,
    );

    $form['default_position'] = array(
      '#type' => 'select',
      '#title' => $this->t('Default Position'),
      '#required' => TRUE,
      '#default_value' => $config->get('default_position') ?: 'bottom-right',
      '#options' => [
        'bottom-left' => 'Bottom Left',
        'bottom-right' => 'Bottom Right',
      ],
    );

    $form['enabled_buttons'] = array(
      '#type' => 'fieldset',
      '#title' => $this->t('Enabled Buttons'),
    );

    $form['enabled_buttons']['enable_edit'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Edit (Alt + E)'),
      '#default_value' => $config->get('enable_edit') !== NULL ? $config->get('enable_edit') : TRUE,
    );
    
    $form['enabled_buttons']['enable_clear_cache'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Clear Cache (Alt + C)'),
      '#default_value' => $config->get('enable_clear_cache') !== NULL ? $config->get('enable_clear_cache') : TRUE,
    );

    $form['enabled_buttons']['enable_run_cron'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Run CRON (Alt + R)'),
      '#default_value' => $config->get('enable_run_cron') !== NULL ? $config->get('enable_run_cron') : TRUE,
    );

    $form['enabled_buttons']['enable_logs'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Recent Logs (Alt + L)'),
      '#default_value' => $config->get('enable_logs') !== NULL ? $config->get('enable_logs') : TRUE,
    );

    $form['enable_for_users'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Specific User List'),
      '#description' => $this->t('Include only the users who should see the toggle admin controls. Seperate different users with a ",". If left blank, it will be enabled for all authenticated users.'),
      '#default_value' => $config->get('enable_for_users') ?: $this->t(''),
    );

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('toggle_admin.settings');
    $values = $form_state->getValues();

    $config->set('toggle_enabled', $values['toggle_enabled']);
    $config->set('toggle_local_tasks', $values['toggle_local_tasks']);
    $config->set('default_on', $values['default_on']);
    $config->set('default_position', $values['default_position']);
    $config->set('enable_clear_cache', $values['enable_clear_cache']);
    $config->set('enable_run_cron', $values['enable_run_cron']);
    $config->set('enable_edit', $values['enable_edit']);
    $config->set('enable_logs', $values['enable_logs']);
    $config->set('enable_for_users', $values['enable_for_users']);
    $config->save();

    parent::submitForm($form, $form_state);
  }
}