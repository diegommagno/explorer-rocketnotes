import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { api } from '../../services/api';

import { FiPlus, FiSearch } from 'react-icons/fi';

import { Container, Brand, Menu, Search, Content, NewNote } from './styles';

import { Header } from '../../components/Header';
import { ButtonText } from '../../components/ButtonText';
import { Input } from '../../components/Input';
import { Section } from '../../components/Section';
import { Note } from '../../components/Note';

export function Home() {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [notes, setNotes] = useState([]);

  const navigate = useNavigate();

  function handleTagSelected(tagName) {
    if (tagName === "all") {
      return setTagsSelected([]);
    }

    const alreadySelected = tagsSelected.includes(tagName); // Verifica se a tag já está selecionada. Retorna false se não estava selecionada e true se já estava selecionada.

    // Caso ela não esteja selecionada, somente seleciona adicionando ela no setTagsSelected.
    if (alreadySelected) {
      const filteredTags = tagsSelected.filter(tag => tag !== tagName); // Retorna todas as tags que são diferentes da tag que foi selecionada.
      setTagsSelected(filteredTags);
    } else {
      setTagsSelected(prevState => [...prevState, tagName]);
    }
  }

  function handleDetails(id) {
    navigate(`/details/${id}`);
  }

  useEffect(() => {
    async function fetchTags() {
      const response = await api.get("/tags");
      setTags(response.data);
    }

    fetchTags();
  }, []);

  useEffect(() => {
    async function fetchNotes() {
      const response = await api.get(`/notes?title=${search}&tags=${tagsSelected}`);
      setNotes(response.data);
    }

    fetchNotes();

  }, [tagsSelected, search]);

  return (
    <Container>
      <Brand>
        <h1>Rocket Notes</h1>
      </Brand>

      <Header />

      <Menu>
        <li>
          <ButtonText 
            title="All"
            onClick={() => handleTagSelected("all")} 
            isActive={tagsSelected.length === 0} // Pega o tagsSelected e se o tamnho dele for 0, isso sera verdadeiro e isActive funciona.
          />
        </li>

        {
          tags && tags.map(tag => (
            <li key={String(tag.id)}>
              <ButtonText 
                title={tag.name} 
                onClick={() => handleTagSelected(tag.name)}
                isActive={tagsSelected.includes(tag.name)} // Returns true if the array contains the element, and false if not.
              />
            </li>
          ))
        }
      </Menu>

      <Search>
        <Input 
          placeholder="Search by title" 
          onChange={(e) => setSearch(e.target.value)}
          icon={FiSearch}
        />
      </Search>

      <Content>
        <Section title="Notes">
          {
            notes.map(note => (
              <Note 
                key={String(note.id)}
                data={note}
                onClick={() => handleDetails(note.id)}
              />
            ))
          }
        </Section>
      </Content>

      <NewNote to="/new">
        <FiPlus />
        Create note       
      </NewNote>
    </Container>
  );
}