import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  SingleSelect,
  Field,
  Input,
  MultiSelect,
  SingleSelectOption,
  MultiSelectOption,
} from '@dhis2/ui';
import ButtonItem from '../ButtonItem/ButtonItem';
import { fetchOrgUnitLevels, fetchOrgUnitGroups } from '../../api/requests.js';
import {
  getCatchmentJob,
  fetchSupportedBoundaries,
} from '../../api/crosscutRequests';
import styles from './JobDetails.module.css';

function JobDetails(props) {
  const { title, action, setShowJobDetailsModal, name, details, id } = props;
  const [boundaries, setBoundaries] = useState(null);
  const [country, setCountry] = useState(null);
  const [areas, setAreas] = useState(null);
  const [countryName, setCountryName] = useState('');
  const [areaName, setAreaName] = useState('');
  const [levels, setLevels] = useState(null);
  const [groups, setGroups] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState();
  const [selectedLevel, setSelectedLevel] = useState();

  useEffect(() => {
    fetchBoundaries();
    fetchLevels();
    fetchGroups();
    fetchJob();
    return () => {
      // This is the cleanup function
    };
  }, []);

  useEffect(() => {
    setSelectedGroup(details.groupId);
    setSelectedLevel(details.levelId);
  }, [details]);

  useEffect(() => {
    if (country !== null) {
      const found = boundaries.find((bound) => {
        if (bound.areas.length !== 0) {
          return bound.areas.some((area) => {
            if (area.id === country) {
              setAreaName(area.name);
              return true;
            }
          });
        } else {
          return bound.id === country;
        }
      });
      setAreas(found.areas);
      setCountryName(found.name);
    }
  }, [country]);

  const fetchJob = async () => {
    const resp = await getCatchmentJob(id);
    setCountry(resp.boundaryId);
  };
  const fetchBoundaries = async () => {
    const respBoundaries = await fetchSupportedBoundaries();
    setBoundaries(respBoundaries);
  };

  const fetchLevels = async () => {
    const respLevels = await fetchOrgUnitLevels();
    setLevels(respLevels);
  };

  const fetchGroups = async () => {
    const respGroups = await fetchOrgUnitGroups();
    setGroups(respGroups);
  };

  // fetch catchment details
  const close = () => {
    setShowJobDetailsModal(false);
  };

  const renderForm = () => {
    return (
      <form>
        <Field label="Select the country">
          <SingleSelect selected={countryName} disabled>
            {boundaries &&
              boundaries.map((bound, index) => {
                return (
                  <SingleSelectOption
                    key={`boundary-${index}`}
                    value={bound.name}
                    label={`${bound.name}`}
                  />
                );
              })}
          </SingleSelect>
        </Field>
        {
          // Render field, if there are areas for the selected country
          areaName && (
            <Field label={'Select the area'}>
              <SingleSelect selected={areaName} disabled>
                {areas &&
                  areas.map((area, index) => {
                    return (
                      <SingleSelectOption
                        key={`area-${index}`}
                        value={area.name}
                        label={`${area.name}`}
                      />
                    );
                  })}
              </SingleSelect>
            </Field>
          )
        }
        <Field label="Name the catchment areas">
          <Input value={name} disabled />
        </Field>
        <div className={styles.filter}>
          <Field label="Select the facility level" readOnly>
            <SingleSelect selected={levels ? selectedLevel : ''} disabled>
              {levels &&
                levels.map((level, index) => {
                  return (
                    <SingleSelectOption
                      key={index}
                      label={level.name}
                      value={level.id}
                    />
                  );
                })}
            </SingleSelect>
          </Field>
          <Field label="Select the groups">
            <MultiSelect selected={groups ? selectedGroup : []} disabled>
              {groups &&
                groups.map((group, index) => {
                  return (
                    <MultiSelectOption
                      key={index}
                      label={group.name}
                      value={group.id}
                    />
                  );
                })}
            </MultiSelect>
          </Field>
        </div>
      </form>
    );
  };

  return (
    <Modal>
      <ModalTitle>{title}</ModalTitle>
      <ModalContent>{renderForm()}</ModalContent>
      <ModalActions>
        <ButtonItem handleClick={close} buttonText={action} primary={true} />
      </ModalActions>
    </Modal>
  );
}

export default JobDetails;
